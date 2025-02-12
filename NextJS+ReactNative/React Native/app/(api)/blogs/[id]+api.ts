// (api)/blogs/[id]+api.ts
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, { id }: { id: string }) {

    if (!id) {
        console.log("❌ Organisation ID is missing");
        return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const sql = neon(`${process.env.DATABASE_URL}`);

        const blogPosts = await sql`
            SELECT 
                id,
                org_id as "orgId",
                content,
                type,
                created_at as "createdAt"
            FROM blog_posts
            WHERE org_id = ${id}
            ORDER BY created_at DESC
        `;

        // If no blog posts found, return empty array
        const transformedData = blogPosts.length > 0 
            ? blogPosts.map(post => ({
                id: post.id,
                orgId: post.orgId,
                content: post.content,
                type: post.type,
                createdAt: post.createdAt
            })) 
            : [];

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