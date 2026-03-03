# Bonucakes - Next.js Comms Suite Refactor Plan

## Project Overview

**Goal:** Refactor Bonucakes website into a full communications suite built on Next.js

**Timeline:** Deep work sessions during Saundersfoot trip (28 Feb - 4 Mar 2026)

## Current State Assessment

### What exists now?
- [ ] Document current tech stack
- [ ] Inventory existing features
- [ ] List all content types
- [ ] Identify integrations

## Target Architecture: Full Comms Suite

### Core Features Needed

#### 1. Public-Facing Website
- Landing page with brand positioning
- About Minh Uyên (her story, philosophy)
- Restaurant showcase
- Workshop/event listings
- Blog/content hub
- Contact information

#### 2. Workshop & Event Management
- Livestream event pages
- Registration/RSVP system
- Calendar integration
- Reminder emails/notifications
- Recording archives

#### 3. Content Management
- Recipe database
- Video content library
- Blog posts
- Customer success stories
- Behind-the-scenes content

#### 4. Community Features
- Customer portal/login
- Discussion forum or comments
- Resource library for members
- Progress tracking for students

#### 5. Marketing & Comms
- Email newsletter system
- Social media integration
- Content scheduling
- Analytics dashboard

#### 6. Business Tools
- Customer inquiry management
- Booking system for consultations
- Payment processing (if needed)
- CRM integration

## Technical Stack Proposal

### Framework: Next.js 14+ (App Router)
**Why Next.js:**
- Server-side rendering for SEO
- Static generation for performance
- API routes for backend functionality
- Easy deployment on Vercel
- React-based for modern UI

### Potential Tech Stack:
```
Frontend:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Framer Motion (animations)

Backend/Services:
- Next.js API routes
- Prisma (database ORM)
- PostgreSQL or Supabase
- Resend (email delivery)
- Uploadthing (file uploads)

Content:
- MDX for blog posts
- Sanity.io or Contentful (headless CMS)
- Or custom content management

Video/Media:
- Cloudinary or Vercel Blob
- YouTube/Vimeo integration
- Custom video player

Authentication:
- NextAuth.js
- Or Clerk

Payment (if needed):
- Stripe

Analytics:
- Vercel Analytics
- Google Analytics 4
- PostHog (product analytics)

Deployment:
- Vercel
- GitHub for version control
```

## Implementation Phases

### Phase 1: Foundation (During Trip - Week 1)
**Deep work sessions with Minh Uyên**

- [ ] Set up Next.js project structure
- [ ] Design system & brand guidelines
- [ ] Component library setup
- [ ] Database schema design
- [ ] Content strategy & information architecture

**Deliverables:**
- Working development environment
- Brand-aligned design system
- Core page layouts
- Content migration plan

### Phase 2: Core Features (Post-trip - Week 2-3)
- [ ] Public website pages
- [ ] Workshop event system
- [ ] Basic content management
- [ ] Email integration
- [ ] Contact forms

### Phase 3: Community & Advanced Features (Week 4-6)
- [ ] User authentication
- [ ] Member portal
- [ ] Video library
- [ ] Recipe database
- [ ] Newsletter system

### Phase 4: Business Tools (Week 7-8)
- [ ] Booking system
- [ ] Payment processing
- [ ] Analytics setup
- [ ] CRM integration
- [ ] Admin dashboard

### Phase 5: Polish & Launch (Week 9-10)
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Mobile responsiveness
- [ ] Testing & QA
- [ ] Content population
- [ ] Go-live checklist

## Deep Work Body Doubling Sessions

### During Saundersfoot Trip

**Friday 28 Feb:**
- Morning: Technical review & requirements gathering with Minh Uyên
- Afternoon: Strategic planning - what does "full comms suite" mean for her business?

**Saturday 1 Mar:**
- Morning: Hands-on - set up project, design system work
- Afternoon: Q&A on features, priorities, content structure

**Sunday 2 Mar:**
- Morning: Continue build work
- Evening: Prep for livestream workshop (content will inform platform features)

**Monday 3 Mar:**
- Morning: Technical implementation session
- Review progress, adjust plan

**Tuesday 4 Mar:**
- Final discussions on post-trip work
- Handoff plan for content migration

## Content Migration Strategy

### From Current Site to New Site
1. Audit all existing content
2. Categorize by type (pages, posts, media, etc.)
3. Create migration scripts or manual process
4. Preserve SEO (redirects, meta data)
5. Improve content during migration

### New Content to Create
Based on brand voice notes:
- Minh Uyên's story page
- Philosophy/approach page
- Workshop series structure
- Customer success stories
- Recipe collection organization

## Success Metrics

### Technical:
- [ ] Lighthouse score >90
- [ ] Mobile-first responsive
- [ ] Sub-2s page load times
- [ ] Accessible (WCAG AA)

### Business:
- [ ] Easy for Minh Uyên to update content
- [ ] Supports workshop registration
- [ ] Grows email list
- [ ] Showcases brand personality
- [ ] Enables community building

### User Experience:
- [ ] Clear value proposition
- [ ] Easy navigation
- [ ] Engaging content presentation
- [ ] Works on all devices
- [ ] Fast and reliable

## Key Questions to Answer with Minh Uyên

1. **Content Management:** Will she update content herself or need help?
2. **Video Strategy:** Where are videos hosted? YouTube, Vimeo, self-hosted?
3. **Community:** Does she want a members-only area? What features?
4. **Workshops:** Free or paid? How to handle registrations?
5. **Email:** Current email list? What platform? Migrate or start fresh?
6. **Language:** Vietnamese only, English only, or bilingual?
7. **E-commerce:** Selling anything? Courses, consultations, merchandise?
8. **Integrations:** What tools does she already use that need to connect?

## Risk Mitigation

### Risks:
- Scope creep during build
- Content not ready for migration
- Technical complexity slowing progress
- Minh Uyên too busy to participate

### Mitigation:
- Clear phase boundaries, ship iteratively
- Start with MVP, add features progressively
- Use proven tech stack, avoid custom solutions
- Async work plan, documented decisions
- Record all sessions for reference

## Post-Launch Maintenance Plan

### Ongoing Support:
- Content updates
- Feature additions
- Bug fixes
- Performance monitoring
- Security updates

### Training for Minh Uyên:
- How to post content
- How to manage workshops/events
- How to view analytics
- How to moderate community

## Budget & Resources

- Development time estimate: [TBD hours]
- Third-party services costs: [TBD]
- Hosting costs: Vercel (likely free tier to start)
- Domain & email: [TBD]
- Media storage: [TBD]

## Next Steps Before Trip

- [ ] Review current Bonucakes website
- [ ] List all questions for Minh Uyên
- [ ] Prepare design mockups/inspiration
- [ ] Set up development environment
- [ ] Create GitHub repository
- [ ] Prepare workshop content outline
