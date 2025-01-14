'use client';
 
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from '~/components/link';
import { useCart } from '~/lib/hooks/useCart';
import { RemoveFromCartButton } from '~/app/[locale]/(default)/cart/_components/remove-from-cart-button';
import { CheckoutButtonPopUp } from './checkout-button';
 
export const MiniCart = ({cartItems,closeModal, cartId}: {cartItems: any, closeModal:any, cartId: string}) => {
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const { cart, loading, removeItem } = useCart();
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
 
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
 
  const hasItems = cartItems?.lineItems?.physicalItems && cartItems.lineItems.physicalItems.length > 0;
 
  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
      // You might want to update the cart state or show a success message here
    } catch (error) {
      console.error('Error removing item:', error);
      // Handle error appropriately
    }
  };
 
  return (
    <div className="relative" ref={cartRef}>
      {/* Cart Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {hasItems && (
          <span className="absolute -right-1 -top-1 min-w-[24px] rounded-[28px] border-2 border-white bg-primary px-1 py-px text-center text-xs font-semibold leading-normal text-white">
            {cartItems?.lineItems?.totalQuantity}
          </span>
        )}
      </button>
 
      {/* Popup Cart */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 z-50 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
             
            </div>
 
            <div className="max-h-96 overflow-y-auto">
              {hasItems ? (
                <>
                  {cartItems?.lineItems?.physicalItems?.map((item: any) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b">
                      <div className="w-20 h-20 bg-gray-100 rounded">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-sm text-gray-500">Brand: {item.brand}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Qty: {item.quantity}</span>
                          </div>
                          <div>
                            <p className="text-sm">Price: £{item.extendedSalePrice.value}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            handleRemoveItem(item.id);
                          }}>
                            <RemoveFromCartButton icon="trash" />
                          </form>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Your cart is empty
                </div>
              )}
            </div>
 
            {hasItems && (
              <div className="mt-4 space-y-2">
                <CheckoutButtonPopUp cartId={cartId} />
                <Link
                  href="/cart"
                  className="block w-full border border-gray-200 text-center py-2 rounded-md hover:bg-gray-100"
                >
                  VIEW CART
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
 
export default MiniCart;