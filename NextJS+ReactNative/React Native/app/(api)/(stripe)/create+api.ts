import { Stripe } from 'stripe';

// Apply secrete key to stripe 
// Important !
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


// Create api route for post method using async function 

export async function POST(request: Request) {
    const body = await request.json();
    
    const { name, email, amount } = body;

    if(!name || !email || !amount){
        return new Response(
            JSON.stringify({

            error: 'Please enter a valid email address ! ', 
            status: 400,
        }),
    );
    }
    // Create a customer 

    let customer;

    const doesCustomerExist = await stripe.customers.list({email});

    // If customer exist ... Get actual exisiting customer
    if(doesCustomerExist.data.length > 0){
        customer = doesCustomerExist.data[0];
    } else{
        // Create new customer 
        const newCustomer = await stripe.customers.create({
            name, 
            email,
        });

        customer = newCustomer;
    }

    // Create a unique key for each customer 

    const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2024-10-28.acacia'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100, // All payments in cents 
    currency: 'zar',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never',
    },
  });

  return new Response(JSON.stringify({
    paymentIntent: paymentIntent,
    ephemeralKey: ephemeralKey,
    customer: customer.id,
    }),
);
}



