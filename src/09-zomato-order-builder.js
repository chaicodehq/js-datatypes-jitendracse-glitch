/**
 * 🍕 Zomato Order Builder
 *
 * Zomato jaisa order summary banana hai! Cart mein items hain (with quantity
 * aur addons), ek optional coupon code hai, aur tujhe final bill banana hai
 * with itemwise breakdown, taxes, delivery fee, aur discount.
 *
 * Rules:
 *   - cart is array of items:
 *     [{ name: "Butter Chicken", price: 350, qty: 2, addons: ["Extra Butter:50", "Naan:40"] }, ...]
 *   - Each addon string format: "AddonName:Price" (split by ":" to get price)
 *   - Per item total = (price + sum of addon prices) * qty
 *   - Calculate:
 *     - items: array of { name, qty, basePrice, addonTotal, itemTotal }
 *     - subtotal: sum of all itemTotals
 *     - deliveryFee: Rs 30 if subtotal < 500, Rs 15 if 500-999, FREE (0) if >= 1000
 *     - gst: 5% of subtotal, rounded to 2 decimal places parseFloat(val.toFixed(2))
 *     - discount: based on coupon (see below)
 *     - grandTotal: subtotal + deliveryFee + gst - discount (minimum 0, use Math.max)
 *     - Round grandTotal to 2 decimal places
 *
 *   Coupon codes (case-insensitive):
 *     - "FIRST50"  => 50% off subtotal, max Rs 150 (use Math.min)
 *     - "FLAT100"  => flat Rs 100 off
 *     - "FREESHIP" => delivery fee becomes 0 (discount = original delivery fee value)
 *     - null/undefined/invalid string => no discount (0)
 *
 *   - Items with qty <= 0 ko skip karo
 *   - Hint: Use map(), reduce(), filter(), split(), parseFloat(),
 *     toFixed(), Math.max(), Math.min(), toLowerCase()
 *
 * Validation:
 *   - Agar cart array nahi hai ya empty hai, return null
 *
 * @param {Array<{ name: string, price: number, qty: number, addons?: string[] }>} cart
 * @param {string} [coupon] - Optional coupon code
 * @returns {{ items: Array<{ name: string, qty: number, basePrice: number, addonTotal: number, itemTotal: number }>, subtotal: number, deliveryFee: number, gst: number, discount: number, grandTotal: number } | null}
 *
 * @example
 *   buildZomatoOrder([{ name: "Biryani", price: 300, qty: 1, addons: ["Raita:30"] }], "FLAT100")
 *   // subtotal: 330, deliveryFee: 30, gst: 16.5, discount: 100
 *   // grandTotal: 330 + 30 + 16.5 - 100 = 276.5
 *
 *   buildZomatoOrder([{ name: "Pizza", price: 500, qty: 2, addons: [] }], "FIRST50")
 *   // subtotal: 1000, deliveryFee: 0, gst: 50, discount: min(500, 150) = 150
 *   // grandTotal: 1000 + 0 + 50 - 150 = 900
 */
export function buildZomatoOrder(cart, coupon) {
  // Validate input
  if (!Array.isArray(cart) || cart.length === 0) return null;
  
  // Process items
  const items = [];
  let subtotal = 0;
  
  for (const cartItem of cart) {
    // Skip items with qty <= 0
    if (!cartItem.qty || cartItem.qty <= 0) continue;
    
    // Calculate addon total
    let addonTotal = 0;
    if (cartItem.addons && Array.isArray(cartItem.addons)) {
      addonTotal = cartItem.addons.reduce((sum, addon) => {
        const price = parseFloat(addon.split(':')[1]);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
    }
    
    // Calculate item total
    const itemTotal = (cartItem.price + addonTotal) * cartItem.qty;
    
    items.push({
      name: cartItem.name,
      qty: cartItem.qty,
      basePrice: cartItem.price,
      addonTotal: addonTotal,
      itemTotal: itemTotal
    });
    
    subtotal += itemTotal;
  }
  
  // Calculate delivery fee
  let deliveryFee;
  if (subtotal >= 1000) {
    deliveryFee = 0;
  } else if (subtotal >= 500) {
    deliveryFee = 15;
  } else {
    deliveryFee = 30;
  }
  
  // Calculate GST (5%)
  const gst = parseFloat((subtotal * 0.05).toFixed(2));
  
  // Calculate discount based on coupon
  let discount = 0;
  if (coupon) {
    const couponUpper = coupon.toUpperCase();
    if (couponUpper === 'FIRST50') {
      discount = Math.min(subtotal * 0.5, 150);
    } else if (couponUpper === 'FLAT100') {
      discount = 100;
    } else if (couponUpper === 'FREESHIP') {
      discount = deliveryFee;
      deliveryFee = 0;
    }
  }
  
  // Calculate grand total
  const grandTotal = parseFloat((Math.max(0, subtotal + deliveryFee + gst - discount)).toFixed(2));
  
  return {
    items: items,
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    gst: gst,
    discount: discount,
    grandTotal: grandTotal
  };
}
