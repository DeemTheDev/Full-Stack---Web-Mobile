"use server"
import { neon } from '@neondatabase/serverless';
import {BlogPost, CreateOrganisationData, DonationHistory, LoginResult, Organisation, OrganisationImage, OrganisationSocial, OrganisationWithDonations, UserWithDonations} from "@/types/type"
import { cookies } from 'next/headers'


export const getDBVersion = async() => {
    const sql = neon(process.env.DATABASE_URL!);
    const response = await sql`SELECT version()`;
    return { version: response[0].version }
}




// Adds organisationf Admin profile 
export const createOrganisationWithAuth = async (data: CreateOrganisationData): Promise<void> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        // First, insert into organisation table
        const [newOrg] = await sql`
            INSERT INTO organisation (
                name, 
                email, 
                description, 
                address, 
                website
            ) VALUES (
                ${data.name},
                ${data.email},
                ${data.description},
                ${data.address},
                ${data.website}
            )
            RETURNING id
        `;

        // Then, insert into authorised_organisations
        await sql`
            INSERT INTO authorised_organisations (
                organisation_id,
                email,
                password
            ) VALUES (
                ${newOrg.id},
                ${data.email},
                ${data.password}
            )
        `;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create organisation with authentication');
    }
};

export const getDonationById = async(id: string): Promise<DonationHistory[]> => {
    const sql = neon(process.env.DATABASE_URL!);
    const response = await sql`
        SELECT 
            d.id,
            d.amount,
            d.donation_date,
            d.organisation_id as org_id,
            d.donor_id
        FROM donations d
        WHERE d.organisation_id = ${id}
        ORDER BY d.id DESC
    `;

    // Transform the database response to match the DonationHistory interface
    const transformedData: DonationHistory[] = response.map(donation => ({
        id: donation.id,
        amount: donation.amount,
        date: donation.donation_date,
        orgId: donation.org_id,
        donor_id: donation.donor_id
    }));

    return transformedData;
}

export const getOrganisation = async(id: string): Promise<Organisation> => {

    const sql = neon(process.env.DATABASE_URL!);
    const response = await sql`
        SELECT 
            o.id,                           
            o.name,         
            o.email,         
            o.description,         
            o.profile_image_url,         
            o.image_url,         
            o.address,         
            o.website,         
            json_agg(                       
                json_build_object(            
                    'id', oi.id,                
                    'image_url', oi.image_url,             
                    'created_at', oi.created_at           
                )
            ) as images                     
        FROM organisation o               
        LEFT JOIN organisation_images oi    
            ON o.id = oi.organisation_id      
        WHERE o.id = ${id}
        GROUP BY o.id`;

    // Handle case where no organization is found
    if (response.length === 0) {
        throw new Error(`Organization with ID ${id} not found`);
    }

    // Transform the database response into TypeScript interface
    const org = response[0];
    const transformedData: Organisation = {
        id: org.id,
        name: org.name,
        email: org.email,
        address: org.address,
        website: org.website,
        description: org.description,
        profile_image_url: org.profile_image_url,
        image_url: org.image_url,
        // Handle case when organization has no images
        images: org.images[0] === null ? [] : org.images
    };

    return transformedData;
};
    
export const getOrganisationImages = async(id: string): Promise<OrganisationImage[]> => {
    const sql = neon(process.env.DATABASE_URL!);
    const response = await sql`
        SELECT 
            id,
            organisation_id,
            image_url,
            created_at
        FROM organisation_images
        WHERE organisation_id = ${id}
        ORDER BY created_at DESC`;

    // If no images found, return empty array
    if (response.length === 0) {
        throw new Error(`No Images...`);
    }
    const image = response[0];
    // Transform the database response to match the interface
 

    return response.map((image): OrganisationImage => ({
        id: image.id,
        organisation_id: image.organisation_id,
        image_url: image.image_url,
        created_at: image.created_at
    }));
};

// Delete an Image 
export const deleteOrganisationImage = async (id: number): Promise<void> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        await sql`
            DELETE FROM organisation_images 
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Error deleting organisation image:', error);
        throw new Error('Failed to delete organisation image');
    }
};


// Admin Functions
export const getUsersWithDonations = async (): Promise<UserWithDonations[]> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        const response = await sql`
            SELECT 
                u.id,
                u.name,
                u.email,
                COALESCE(SUM(d.amount), 0) as total_donations
            FROM users u
            LEFT JOIN donations d ON u.clerk_id = d.donor_id
            GROUP BY u.id, u.name, u.email
            ORDER BY total_donations DESC NULLS LAST`;

        return response.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            total_donations: Number(user.total_donations) || 0
        }));
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch users with donations');
    }
};

export const getOrganisationsWithDonations = async (): Promise<OrganisationWithDonations[]> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        const response = await sql`
            SELECT 
                o.id,
                o.name,
                o.email,
                COALESCE(SUM(d.amount), 0) as total_received
            FROM organisation o
            LEFT JOIN donations d ON o.id = d.organisation_id
            GROUP BY o.id, o.name, o.email
            ORDER BY total_received DESC NULLS LAST`;

        return response.map(org => ({
            id: org.id,
            name: org.name,
            email: org.email,
            total_received: Number(org.total_received) || 0
        }));
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch organisations with donations');
    }
};

// Delete Organisation from all related tables 
export const deleteOrganisation = async (id: number): Promise<void> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        // First delete related images
        await sql`
            DELETE FROM organisation_images 
            WHERE organisation_id = ${id}
        `;

        // Delete from related social media 
        await sql`
            DELETE FROM organisation_social 
            WHERE organisation_id = ${id}
        `;

        // Delete from authorised_organisations
        await sql`
            DELETE FROM authorised_organisations 
            WHERE organisation_id = ${id}
        `;

        // Then delete related donations
        await sql`
            DELETE FROM donations 
            WHERE organisation_id = ${id}
        `;
        
        // Finally delete the organisation
        await sql`
            DELETE FROM organisation 
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to delete organisation');
    }
};

// Login function for organisation 
export const verifyOrganisationLogin = async (email: string, password: string): Promise<LoginResult> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        const result = await sql`
            SELECT 
                o.id,
                o.name,
                o.email,
                ao.password
            FROM organisation o
            JOIN authorised_organisations ao ON o.id = ao.organisation_id
            WHERE o.email = ${email}
            LIMIT 1
        `;

        if (result.length === 0) {
            return { success: false, error: 'Invalid credentials' };
        }

        if (result[0].password === password) {
            // Set a secure HTTP-only cookie
            (await
                // Set a secure HTTP-only cookie
                cookies()).set({
                name: 'org_id',
                value: result[0].id.toString(),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                // Set expiry time (e.g., 24 hours)
                maxAge: 60 * 60 * 24
            });

            return {
                success: true,
                organisationId: result[0].id,
                name: result[0].name
            };
        }

        return { success: false, error: 'Invalid credentials' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'An error occurred during login' };
    }
};

// Add a logout function
export const logoutOrganisation = async () => {
    (await cookies()).delete('org_id');
};


// Get social media links
export const getOrganisationSocial = async (organisationId: number): Promise<OrganisationSocial | null> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        const response = await sql`
            SELECT 
                facebook_url,
                twitter_url,
                instagram_url
            FROM organisation_social
            WHERE organisation_id = ${organisationId}
        `;

        if (response.length === 0) {
            return null;
        }

        // Explicitly type the return value
        const socialLinks: OrganisationSocial = {
            facebook_url: response[0].facebook_url || null,
            twitter_url: response[0].twitter_url || null,
            instagram_url: response[0].instagram_url || null
        };

        return socialLinks;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch organisation social links');
    }
};
// Update social media links
export const updateOrganisationSocial = async (
    organisationId: number,
    socialLinks: OrganisationSocial
): Promise<void> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        // Using upsert (insert or update) with ON CONFLICT
        await sql`
            INSERT INTO organisation_social (
                organisation_id,
                facebook_url,
                twitter_url,
                instagram_url
            ) VALUES (
                ${organisationId},
                ${socialLinks.facebook_url},
                ${socialLinks.twitter_url},
                ${socialLinks.instagram_url}
            )
            ON CONFLICT (organisation_id) 
            DO UPDATE SET
                facebook_url = ${socialLinks.facebook_url},
                twitter_url = ${socialLinks.twitter_url},
                instagram_url = ${socialLinks.instagram_url}
        `;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to update organisation social links');
    }
};


export const updateOrganisationDescription = async (
    organisationId: number,
    description: string
): Promise<void> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        await sql`
            UPDATE organisation
            SET description = ${description}
            WHERE id = ${organisationId}
        `;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to update organisation description');
    }
};

export const updateOrganisationAddress = async (
    organisationId: number,
    address: string
): Promise<void> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        await sql`
            UPDATE organisation
            SET address = ${address}
            WHERE id = ${organisationId}
        `;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to update organisation address');
    }
};
// Update organisation images 
export const updateOrganisationProfileImage = async (
  organisationId: number,
  profileImageUrl: string
): Promise<void> => {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    await sql`
      UPDATE organisation 
      SET profile_image_url = ${profileImageUrl}
      WHERE id = ${organisationId}
    `;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update organisation profile image');
  }
};

// Upload images 
export const addOrganisationImage = async (
  organisationId: number,
  imageUrl: string
): Promise<void> => {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    await sql`
      INSERT INTO organisation_images (
        organisation_id,
        image_url,
        created_at
      ) VALUES (
        ${organisationId},
        ${imageUrl},
        NOW()
      )
    `;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add organisation image');
  }
};

// Function for updating email and website
export const updateOrganisationUrlDetails = async (
  organisationId: number,
  details: {
    email: string;
    website: string;
  }
): Promise<void> => {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    // Begin transaction
    await sql`BEGIN`;

    try {
      // Update organisation table
      await sql`
        UPDATE organisation 
        SET 
          email = ${details.email},
          website = ${details.website}
        WHERE id = ${organisationId}
      `;

      // Update authorised_organisations table
      await sql`
        UPDATE authorised_organisations 
        SET 
          email = ${details.email}
        WHERE organisation_id = ${organisationId}
      `;

      // Commit transaction
      await sql`COMMIT`;
    } catch (error) {
      // Rollback on error
      await sql`ROLLBACK`;
      throw error;
    }
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update organisation details');
  }
};

// Get all blog posts for an organization
export const getBlogPosts = async (orgId: string): Promise<BlogPost[]> => {
    const sql = neon(process.env.DATABASE_URL!);
    const response = await sql`
        SELECT 
            id,
            org_id,
            content,
            type,
            created_at
        FROM blog_posts
        WHERE org_id = ${orgId}
        ORDER BY created_at DESC`;

    if (response.length === 0) {
        return [];
    }

    return response.map((post): BlogPost => ({
        id: post.id,
        orgId: post.org_id,
        content: post.content,
        type: post.type,
        createdAt: post.created_at
    }));
};

// Create a new blog post
export const createBlogPost = async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    const response = await sql`
        INSERT INTO blog_posts (
            org_id,
            content,
            type,
            created_at
        ) VALUES (
            ${post.orgId},
            ${post.content},
            ${post.type},
            ${post.createdAt}
        )
        RETURNING id, org_id, content, type, created_at
    `;

    const newPost = response[0];
    return {
        id: newPost.id,
        orgId: newPost.org_id,
        content: newPost.content,
        type: newPost.type,
        createdAt: newPost.created_at
    };
};


// Delete a blog post
export const deleteBlogPost = async (id: string): Promise<void> => {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        await sql`
            DELETE FROM blog_posts 
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Error deleting blog post:', error);
        throw new Error('Failed to delete blog post');
    }
};