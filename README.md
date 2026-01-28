# Urban Bees Sale Website

A fast, responsive Next.js website for selling beekeeping equipment. Features product browsing with variants, product detail pages, persistent cart, and PayPal.me checkout integration.

## 🚀 Features

- **Next.js App Router** with TypeScript and Tailwind CSS
- **Product Detail Pages** with breadcrumbs, two-column layout, and back navigation
- **Product Variants** with dynamic pricing and stock tracking
- **Persistent Cart** using Zustand with localStorage
- **PayPal.me Integration** for checkout
- **Responsive Design** - mobile, tablet, and desktop optimized
- **Subfolder Deployment** - configured for `/sale` path
- **Description & Features Display** - Rich product information

## 📦 Products

The site includes a comprehensive inventory of beekeeping equipment from "regents park stock check.docx":

- **Brood Boxes** - National, 14x12, WBC (various materials and configurations)
- **Supers** - Multiple sizes and materials
- **Nucs & Travel Boxes** - Cedar, OSB, Plywood, and Plastic options
- **Floors & Stands** - Open mesh floors, hive stands, legs
- **Lids & Roofs** - Crown boards, metal roofs, gabled roofs
- **Boards & Excluders** - Queen excluders, cover boards, clearing boards
- **Frames & Foundation** - Multiple frame types with wax or foundation
- **Extraction & Honey Equipment** - Honey buckets, extractors, filters
- **Queen Rearing** - Cell protectors, cages, frame traps
- **Apparel** - Bee suits, veils, gloves (various sizes)
- **Footwear** - Wellington boots (sizes 4-6)
- **Accessories** - Hive tools, smokers, feeders, entrance blocks

All products include:
- Dynamic pricing based on variants
- Stock quantity tracking
- MSRP reference prices (often Thornes prices)
- Detailed product information where available

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn

### Steps

1. **Install dependencies:**

```powershell
npm install
# or
pnpm install
# or
yarn install
```

## 💻 Development

### Run development server:

```powershell
npm run dev
```

Open [http://localhost:3000/sale](http://localhost:3000/sale) in your browser.

The site is configured with `basePath: '/sale'` so all routes are prefixed with `/sale`.

### Key Routes

- `/sale` - Main products listing page
- `/sale/product/[id]` - Individual product detail page
- `/sale/checkout` - Cart checkout page

### Development Notes

- Product detail pages are client components with hydration guards
- Cart interactions use Zustand store with client components
- Cart state persists in localStorage
- Images use Next.js `<Image>` with `unoptimized: true`
- Static export is temporarily disabled in development (see Technical Notes)

## 🏗️ Build for Production

### Important Note

Static export (`output: 'export'`) is currently disabled in `next.config.js` to allow dynamic product detail pages during development. When ready for production deployment, you can:

1. Re-enable static export in `next.config.js`
2. Pre-generate all product pages at build time
3. Or deploy to a platform that supports Next.js server-side features (Vercel, Netlify, etc.)

### Build the site:

```powershell
npm run build
```

For static export, this would create an optimized static export in the `/out` directory. Without static export, use `npm start` to run the production server.

### Build Output

After building, the `/out` folder contains:
```
out/
├── sale/
│   ├── index.html          (Products page)
│   ├── checkout/
│   │   └── index.html      (Checkout page)
│   ├── _next/              (JS, CSS, chunks)
│   └── ...
```

## 🌐 Deployment

### Deploy to Web Server via FTP

1. **Build the project:**
   ```powershell
   npm run build
   ```

2. **Upload the `/out/sale` directory to your web server**

   Upload everything inside `/out/sale/` to the `/sale` directory on your server.

   Your server structure should be:
   ```
   public_html/
   ├── (main site files)
   └── sale/
       ├── index.html
       ├── checkout/
       ├── _next/
       └── ...
   ```

3. **Access the site:**
   ```
   https://www.urbanbees.co.uk/sale
   ```

### Server Requirements

- Static file hosting (no server-side runtime needed)
- Support for HTML5 pushState routing (most modern servers)
- HTTPS recommended for PayPal redirects

### FTP Upload Instructions

Using FileZilla or similar FTP client:

1. Connect to your server
2. Navigate to your public web directory (e.g., `public_html` or `www`)
3. Create `/sale` directory if it doesn't exist
4. Upload all contents of `/out/sale/` to the server's `/sale` directory
5. Verify permissions (files: 644, directories: 755)
6. Test in browser: `https://www.urbanbees.co.uk/sale`

## 🎨 Customization

### Update Products

Edit `src/data/products.ts` to:
- Add/remove products
- Change prices
- Modify variants
- Update descriptions

### Replace Images

1. Add images to `/public/images/`
2. Update product image paths in `src/data/products.ts`
3. Or continue using Unsplash URLs

### Styling

- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.js`
- Color scheme uses:
  - Amber-500 (#f59e0b) - primary accent
  - Stone-100 (#f5f5f4) - backgrounds
  - Zinc-800 (#27272a) - text

### PayPal Configuration

Update the PayPal username in `src/app/checkout/page.tsx`:

```typescript
const paypalUrl = `https://www.paypal.me/YourUsername/${total.toFixed(2)}`;
```

## 🔧 Technical Details

### Static Export Configuration

The `next.config.js` includes critical settings:

```javascript
{
  // output: 'export',        // Temporarily disabled for dynamic routes
  basePath: '/sale',          // All routes prefixed with /sale
  assetPrefix: '/sale/',      // Assets load from /sale
  trailingSlash: true,        // URLs end with /
  images: { 
    unoptimized: true         // No image optimization (static)
  }
}
```

**Note:** Static export is temporarily commented out to support client-side dynamic product pages. For production, consider deploying to a platform that supports Next.js dynamic routes or implement a static page generation strategy.

### Product Detail Pages

- Located at `/sale/product/[id]`
- Client-side rendered with hydration guards
- Features:
  - Breadcrumb navigation (Home / Category / Product)
  - Back button using router
  - Two-column responsive layout (image left, details right)
  - Product description and features list
  - Variant selection with dynamic pricing
  - Stock availability display
  - Add to cart functionality
  - Toast notifications

### Hydration Safety

Product detail pages use a client-side hydration guard to prevent React hydration errors:

```typescript
const [isClient, setIsClient] = useState(false);
useEffect(() => {
  setIsClient(true);
}, []);
```

This ensures the server-rendered HTML matches the initial client render perfectly.

### Cart Persistence

- Uses Zustand with localStorage middleware
- Cart persists across page refreshes
- SSR-safe (only hydrates in browser)

### Navigation

- All internal links use Next.js `<Link>` component
- Links automatically include `/sale` basePath
- Product cards link to detail pages
- External link to main site: `https://www.urbanbees.co.uk`

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled for cart functionality

## 🐛 Troubleshooting

### Issue: Hydration errors in product pages

- Fixed by using client-side hydration guards with `useEffect`
- Ensures server and client HTML match during initial render
- Button content waits for client-side mount

### Issue: 404 errors on product detail pages

- Ensure dynamic routes are supported by your hosting platform
- Or re-enable static export with `generateStaticParams` for all products
- Check `basePath` is correctly configured

### Issue: 404 errors after deployment

- Ensure `/out/sale/` contents are uploaded to server's `/sale/` directory
- Check server supports HTML5 routing or has proper .htaccess rules

### Issue: Images not loading

- Verify image paths are correct in `src/data/products.ts`
- Check server CORS settings for external images (Unsplash)
- Ensure `images.unoptimized: true` in `next.config.js`

### Issue: Cart not persisting

- Check browser localStorage is enabled
- Verify no browser extensions blocking storage
- Check for JavaScript errors in console

### Issue: Broken links/assets

- Verify `basePath: '/sale'` in `next.config.js`
- Ensure using Next.js `<Link>` for internal navigation
- Check asset paths are relative or use basePath

## 📄 Project Structure

```
sale/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Header/Cart
│   │   ├── page.tsx            # Products listing page
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Dynamic product detail page
│   │   ├── checkout/
│   │   │   └── page.tsx        # Checkout page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Header.tsx          # Site header with nav
│   │   ├── CartDrawer.tsx      # Slide-out cart
│   │   ├── FloatingCartButton.tsx  # Mobile cart button
│   │   └── ProductCard.tsx     # Product display card (with links)
│   ├── data/
│   │   └── products.ts         # Product data & pricing (730 lines)
│   └── store/
│       └── cart.ts             # Zustand cart store
├── public/                     # Static assets
│   └── images/                 # Product placeholder images
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 📝 License

Private project for Urban Bees.

## 🤝 Support

For questions or issues, contact the Urban Bees team.

---

**Built with ❤️ and 🐝 for Urban Bees**
