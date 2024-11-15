import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
 
import { getChannelIdFromLocale } from '~/channels.config';
import { getCart } from '~/client/queries/get-cart';
 
export const GET = async (request: NextRequest) => {
  const cartId = cookies().get('cartId')?.value;
 
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get('locale') ?? undefined;
 
  if (cartId) {
    const cart = await getCart(cartId, getChannelIdFromLocale(locale));
 
    return NextResponse.json({ count: cart?.lineItems.totalQuantity ?? 0, cartItems: cart });
  }
 
  return NextResponse.json({ count: 0, cartItems: [] });
};
 
export const runtime = 'edge';