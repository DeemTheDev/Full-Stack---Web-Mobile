// (api)/[id]+api.ts
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, {id}: {id: string}) {
 
    if (!id) {
        console.log("❌ ID is missing");
        return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const sql = neon(`${process.env.DATABASE_URL}`);

        const [socialLinks] = await sql`
            SELECT 
                facebook_url,
                twitter_url,
                instagram_url
            FROM organisation_social
            WHERE organisation_id = ${id}
        `;
        
        

        // Transform the data if needed
        const transformedData = socialLinks ? {
            facebook_url: socialLinks.facebook_url,
            twitter_url: socialLinks.twitter_url,
            instagram_url: socialLinks.instagram_url
        } : null;

        return Response.json({ data: transformedData });

    } catch (error) {
        console.log("❌ Error Details:", {
            message: error,
            stack: error,
            errorObject: error
        });
        return Response.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}