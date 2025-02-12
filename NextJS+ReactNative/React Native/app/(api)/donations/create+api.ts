import {neon} from "@neondatabase/serverless";


export async function POST(request: Request) {
    try {
       
        const {
            amount,
            donation_date,
            organisation_id,
            donor_id,
        } = await request.json();

        if (
            !amount ||
            !donation_date ||
            !organisation_id ||
            !donor_id
        ) {
            return Response.json(
                {error: "Missing required fields"},
                {status: 400},
            );
        }

        const sql = neon(`${process.env.DATABASE_URL}`);

        const response = await sql`
        INSERT INTO donations ( 
          amount, 
          donation_date, 
          organisation_id, 
          donor_id
        ) VALUES (
          ${amount},
          ${donation_date},
          ${organisation_id},
          ${donor_id}
    )
        `;

        return Response.json({data: response[0]}, {status: 201});
    } catch (error) {
        console.error("Error inserting data into donations table:", error);
        return Response.json({error: "Internal Server Error"}, {status: 500});
    }
}