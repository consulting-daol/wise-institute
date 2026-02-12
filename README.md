# WISE Institute Website

A modern, responsive website for WISE Institute - Western Implant and Surgical Excellence, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Clean, professional design with custom color scheme
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: AOS (Animate On Scroll) animations throughout
- **Interactive Forms**: Contact and registration forms with validation
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Fast Performance**: Optimized with Next.js and modern web standards
- **CMS Integration**: Contentful-based CMS for easy image and video management

## Color Scheme

- **Primary Color**: #013D3A (Dark Teal)
- **Secondary Color**: #1A1A66 (Navy Blue)
- **Background Color**: #F4F3F2 (Soft Off-White)
- **Font**: Pretendard (Korean-friendly font)

## Pages

1. **Home** - Hero section with program overview and statistics
2. **About WISE** - Company story, timeline, and values
3. **Programs** - Detailed information about Implant Residency and Live Surgery Study Club
4. **Our Directors** - Profiles of Dr. Chris Lee and Dr. Stephen Yoon
5. **Gallery** - Photo showcase of programs and community moments
6. **Schedule** - Upcoming program dates and registration forms
7. **Contact** - Contact information, forms, and FAQ
8. **Culture** - Community values and testimonials

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: AOS (Animate On Scroll)
- **Font**: Pretendard (Korean-friendly)
- **CMS**: Contentful (for media management)
- **Image Processing**: Sharp (WebP conversion)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wise-institute
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` (if exists)
   - Configure Contentful and admin credentials (see [CMS_SETUP.md](./CMS_SETUP.md))

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About WISE page
│   ├── programs/          # Programs page
│   ├── directors/         # Directors page
│   ├── gallery/           # Gallery page
│   ├── schedule/          # Schedule page
│   ├── contact/           # Contact page
│   ├── culture/           # Culture page
│   ├── admin/             # Admin CMS page
│   ├── login/             # Admin login page
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── admin/         # Admin API endpoints
│   │   └── media/         # Media API endpoints
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Navbar.tsx         # Navigation component
│   ├── Footer.tsx         # Footer component
│   └── AOSProvider.tsx   # Animation provider
├── lib/                   # Utility functions
│   ├── utils.ts           # Utility functions
│   ├── contentful.ts      # Contentful client
│   └── contentfulManagement.ts  # Contentful management API
└── styles/                # Global styles
    └── globals.css        # Global CSS with Tailwind
```

## Customization

### Colors
Update the color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#013D3A',    // Dark teal
      secondary: '#1A1A66',  // Navy blue
      background: '#F4F3F2', // Soft off-white
    },
  },
}
```

### Fonts
The Pretendard font is loaded via CDN in `globals.css`. To use a local font file, update the import and add the font file to the `public` directory.

### Content
- **Static Content**: Most content is hardcoded in page components
- **Dynamic Media**: Images and videos are managed through the integrated Contentful CMS
- **CMS Access**: Visit `/admin` to manage media content (requires admin login)

For CMS setup instructions, see [CMS_SETUP.md](./CMS_SETUP.md).

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact:
- Email: info@wiseinstitute.com
- Phone: (604) 555-0123

---

Built with ❤️ for WISE Institute
