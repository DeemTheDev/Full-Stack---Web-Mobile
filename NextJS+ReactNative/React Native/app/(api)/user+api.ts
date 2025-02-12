
import { neon } from '@neondatabase/serverless';
// ALL SERVER LOGIC DONE HERE !!!
    // INTERACT WITH THE DATABASE

    // THIS API ROUTE WILL BE FOR (USERS) users+api 


// EXPORT A POST OR GET METHOD AS A FUNCTION TO USE AS SQL QUERIES IN UI 
export async function POST(request:Request) {


    try{
    // Connection string to NEON database 
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Get user Name, Email and clerkID (verified user!)
    const {name, email,  clerkId} = await request.json();
    
    // If no access to above credentials:
    if(!name || !email || !clerkId){
        return Response.json(
            {error: 'Missing required fields'},
            {status: 400}
        )
    }


    // If fields exist:
    // User sql query to get the name, password and clerkId ]
    const response = await sql`
        INSERT INTO users(
        name, 
        email,
        clerk_id
        )
        VALUES(
        ${name}, 
        ${email}, 
        ${clerkId}
        )

    `;

    // Return new response 
    return new Response(JSON.stringify({
        data: response
    }), {
        status: 201
    })

    }catch(error){
        console.error("Error creating user:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
    
}