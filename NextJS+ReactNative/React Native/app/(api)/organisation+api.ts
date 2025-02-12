// (api)/organisation+api.ts
import { Organisation } from "@/types/type";
import { neon } from "@neondatabase/serverless";


// (api)/organisation+api.ts

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    // This query joins the organisation table (aliased as 'o') 
    // with organisation_images table (aliased as 'oi')
    const orgsResponse = await sql`
      SELECT 
        o.id,                           -- 'o.' refers to the organisation table
        o.name,
        o.email,
        o.description,
        o.profile_image_url,
        o.image_url,
        o.address,
        o.website,
        json_agg(                       -- PostgreSQL function to aggregate rows into a JSON array
          json_build_object(            -- Builds a JSON object for each image
            'id', oi.id,                -- 'oi.' refers to the organisation_images table
            'image_url', oi.image_url,
            'created_at', oi.created_at
          )
        ) as images                     -- This will create an 'images' array for each organisation
      FROM organisation o               -- Main table with alias 'o'
      LEFT JOIN organisation_images oi    -- Joining with images table, alias 'oi'
        ON o.id = oi.organisation_id      -- Join condition
      GROUP BY o.id                       -- Group results by organisation ID
    `;

    // Transform the database response into TypeScript interface (/TYPES/TYPE.D.TS)
    const transformedData: Organisation[] = orgsResponse.map(org => ({
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
    }));

    return Response.json({ data: transformedData });
  } catch (error) {
    console.log("Error Fetching Organisation Details...", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}