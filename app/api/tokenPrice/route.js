import Moralis from "moralis";

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

export const GET = async (request) => {
  const url = request.nextUrl.searchParams;
  const addressOne = url.get("addressOne");
  const addressTwo = url.get("addressTwo");

  try {
    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: addressOne,
    });

    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: addressTwo,
    });

    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice,
      tokenTwo: responseTwo.raw.usdPrice,
      ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
    };

    return new Response(JSON.stringify(usdPrices), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
  }
};
