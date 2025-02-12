// (api)/donations/[id]+api.ts
import { DonationHistory } from "@/types/type";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, {id}: {id: string}) {

 
    if (!id) {
      console.log("❌ ID is missing");
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const sql = neon(`${process.env.DATABASE_URL}`);

        const response = await sql`
          SELECT * FROM donations WHERE donor_id = ${id}
        `;
        

        const transformedData: DonationHistory[] = response.map(donation => ({
          id: donation.id,
          amount: donation.amount,
          date: donation.donation_date,
          orgId: donation.organisation_id.toString(),
          donor_id: donation.donor_id
        }));

return Response.json({ data: transformedData });

    } catch (error) {
        // Enhanced error logging
        console.log("❌ Error Details:", {
            message: error,
            stack: error,
            errorObject: error
        });
        console.log("Error Fetching Donation History...", error);
        return Response.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
    }
}