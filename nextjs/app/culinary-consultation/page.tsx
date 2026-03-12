'use client';

import { useEffect } from 'react';
import FadeInObserver from '@/components/FadeInObserver';
import { useLanguage } from '@/components/LanguageToggle';
import HeroSection from './components/HeroSection';
import CredentialsSection from './components/CredentialsSection';
import CaseStudiesSection from './components/CaseStudiesSection';
import B2BServicesSection from './components/B2BServicesSection';
import CoursesSection from './components/CoursesSection';
import BusinessModelsSection from './components/BusinessModelsSection';
import FAQSection from './components/FAQSection';
import ContactFormSection from './components/ContactFormSection';

export default function CulinaryConsultationPage() {
  const currentLang = useLanguage();

  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  const content = {
    vi: {
      // Hero section
      heroLabel: 'Tư vấn chuyên nghiệp',
      heroHeading: 'Tư vấn ẩm thực & Vận hành F&B',
      heroSubheading: 'Từ công thức đến vận hành nhà hàng hoàn chỉnh - Bonu đồng hành cùng bạn trên mọi hành trình',
      heroCatchphrase: 'Từ công thức đỉnh cao đến chuỗi nhà hàng thịnh vượng',
      heroCta1: 'Tư vấn doanh nghiệp',
      heroCta2: 'Khóa học cá nhân',

      // Credentials section
      credentialsLabel: 'Kinh nghiệm & Chứng chỉ',
      credentialsHeading: 'Được đào tạo bởi những tên tuổi hàng đầu thế giới',
      credential1Title: 'Le Cordon Bleu',
      credential1Text: 'Được đào tạo chính thức tại Le Cordon Bleu - trường ẩm thực hàng đầu thế giới. Nắm vững kỹ thuật cổ điển Pháp, nghệ thuật làm bánh patisserie, và tiêu chuẩn vệ sinh an toàn thực phẩm quốc tế. Chứng chỉ Grand Diplôme đảm bảo chất lượng đào tạo cao nhất.',
      credential2Title: 'Khách sạn 5 sao',
      credential2Text: 'Hơn 5 năm kinh nghiệm làm việc tại bếp của các khách sạn 5 sao và nhà hàng Michelin-starred. Thành thạo quản lý bếp quy mô lớn, kiểm soát chất lượng nghiêm ngặt, và duy trì tiêu chuẩn phục vụ cao cấp. Hiểu rõ vận hành F&B chuyên nghiệp từ trong ra ngoài.',
      credential3Title: '10+ năm kinh nghiệm',
      credential3Text: 'Hơn 10 năm nghiên cứu và phát triển công thức trong ngành F&B. Đã tạo ra hàng trăm công thức được chuẩn hóa, test kỹ lưỡng và tối ưu hóa cho sản xuất quy mô. Chuyên môn sâu trong việc cải tiến công thức truyền thống và phát triển món ăn mới phù hợp thị trường đương đại.',
      credential4Title: 'Khách hàng toàn cầu',
      credential4Text: 'Đã tư vấn thành công cho khách hàng từ Na Uy, Pháp, Mỹ, Úc, UK và nhiều quốc gia khác. Chuyên gia trong việc điều chỉnh công thức cho nguyên liệu địa phương, thích nghi với khẩu vị văn hóa, và xây dựng quy trình vận hành phù hợp từng thị trường. Hỗ trợ từ xa hiệu quả qua video call và tài liệu chi tiết.',

      // Case Studies section
      caseStudiesLabel: 'Dự án thành công',
      caseStudiesHeading: 'Những câu chuyện thành công',
      caseStudy1Title: 'Wow Banh Mi - Manchester',
      caseStudy1Desc: 'Tư vấn toàn diện cho tiệm bánh mì Việt Nam tại Ancoats, từ phát triển công thức bánh mì và phở đến thiết lập quy trình vận hành chuẩn hóa',
      caseStudy1Detail: 'Kết quả: Được Manchester Evening News vinh danh trong "30 nhà hàng xuất sắc nhất 2025". Đạt rating 4.9/5 với hơn 500 đánh giá. Bánh mì với "bánh baguette nhẹ, xốp" và nước sốt tự làm đã tạo lập "lượng khách trung thành đáng kể vào giờ trưa", trở thành biểu tượng ẩm thực Việt Nam tại khu vực Oldham Road.',
      caseStudy2Title: 'Memoire Saigon - Saundersfoot',
      caseStudy2Desc: 'Tư vấn concept nhà hàng Việt Nam cao cấp tại thị trấn ven biển xứ Wales',
      caseStudy2Detail: 'Kết quả: Mang ẩm thực Việt Nam chính hiệu đến Saundersfoot, tạo điểm nhấn văn hóa độc đáo trong cộng đồng địa phương',
      caseStudy3Title: '',
      caseStudy3Desc: '',
      caseStudy3Detail: '',

      // Services section
      sectionLabel: 'Dịch vụ',
      heading: 'Các gói tư vấn',
      subheading: 'Từ học công thức đến mở nhà hàng hoàn chỉnh',

      // B2B Services
      b2bLabel: 'Dịch vụ B2B - Tư vấn nhà hàng toàn diện',
      b2bHeading: 'Giải pháp trọn gói cho nhà hàng & quán cà phê',

      service1Title: 'Phát triển Concept & Chiến lược',
      service1Desc: 'Xây dựng nền tảng vững chắc cho nhà hàng của bạn từ ý tưởng ban đầu đến chiến lược kinh doanh chi tiết. Phân tích thị trường, đối thủ cạnh tranh, và xác định USP (điểm khác biệt độc đáo) để tạo lợi thế cạnh tranh bền vững.',
      service1Items: [
        'Nghiên cứu thị trường và phân tích đối thủ cạnh tranh tại địa phương',
        'Phát triển concept nhà hàng độc đáo phù hợp với thị trường mục tiêu',
        'Xây dựng kế hoạch kinh doanh chi tiết với dự báo tài chính 3-5 năm',
        'Phân tích ROI và breakeven point cụ thể',
        'Phát triển menu với cost analysis và profit margin tối ưu',
        'Chiến lược định giá cạnh tranh dựa trên food cost và thị trường',
        'Xác định target customer và positioning strategy'
      ],

      service2Title: 'Thiết kế Toàn diện',
      service2Desc: 'Thiết kế chuyên nghiệp từ nhà bếp đến không gian khách hàng, đảm bảo workflow hiệu quả và trải nghiệm tối ưu. Bao gồm thiết kế thương hiệu, menu, và website để tạo ấn tượng mạnh mẽ với khách hàng.',
      service2Items: [
        'Thiết kế bố trí nhà bếp chuyên nghiệp tối ưu workflow và năng suất',
        'Lựa chọn thiết bị nhà bếp phù hợp với budget và nhu cầu vận hành',
        'Thiết kế menu in ấn chuyên nghiệp (print & digital format)',
        'Thiết kế website với tích hợp đặt món online và payment gateway',
        'Thiết kế không gian bếp và quầy bar tối ưu hiệu suất',
        'Branding package: logo, color scheme, typography',
        'Thiết kế packaging cho takeaway và delivery'
      ],

      service3Title: 'Vận hành & Hệ thống',
      service3Desc: 'Xây dựng hệ thống vận hành chuẩn hóa để nhà hàng của bạn hoạt động hiệu quả và nhất quán. Từ SOP chi tiết đến quản lý tồn kho và kiểm soát chi phí, đảm bảo mọi quy trình được tối ưu hóa.',
      service3Items: [
        'Phát triển SOP (Standard Operating Procedures) chi tiết cho mọi vị trí',
        'Thiết lập hệ thống EPOS phù hợp (Square, Toast, hoặc tương tự)',
        'Hệ thống quản lý tồn kho và ordering với par levels',
        'Recipe costing và menu engineering để tối ưu lợi nhuận',
        'Kiểm soát food cost và labor cost với KPI tracking',
        'Hệ thống báo cáo hàng ngày, hàng tuần, hàng tháng',
        'Checklist chất lượng và food safety compliance',
        'Supplier management và negotiation support'
      ],

      service4Title: 'Đào tạo Nhân viên',
      service4Desc: 'Đào tạo toàn diện cho đội ngũ nhân viên của bạn từ kỹ thuật nấu ăn, phục vụ chuyên nghiệp đến quản lý hiệu quả. Đảm bảo team của bạn sẵn sàng mang đến trải nghiệm tuyệt vời cho khách hàng từ ngày đầu tiên.',
      service4Items: [
        'Đào tạo kỹ thuật nấu ăn và chuẩn bị món theo recipes chuẩn hóa',
        'Training về food safety, hygiene và allergen awareness',
        'Đào tạo phục vụ xuất sắc: customer service và upselling techniques',
        'Till training và EPOS system operation',
        'Đào tạo quản lý: shift management, staff scheduling, inventory',
        'Team building và creating positive work culture',
        'Hỗ trợ khai trương: soft launch planning và execution',
        'On-site support trong tuần đầu tiên khai trương'
      ],

      service5Title: 'Sales & Marketing',
      service5Desc: 'Chiến lược marketing toàn diện để tạo buzz trước khi khai trương và duy trì momentum sau đó. Từ quảng cáo digital đến quản lý social media, chúng tôi giúp bạn tiếp cận và giữ chân khách hàng hiệu quả.',
      service5Items: [
        'Chiến lược marketing & branding tổng thể',
        'Pre-launch marketing campaign: tạo buzz trước khai trương',
        'Setup và quản lý Google Ads với budget optimization',
        'Setup và quản lý Facebook/Instagram Ads targeting địa phương',
        'Quản lý social media hàng ngày (3 tháng): content creation, posting, engagement',
        'Photography và videography cho menu items và space',
        'Setup Google My Business và review management strategy',
        'Partnership với food delivery platforms (Deliveroo, Uber Eats, Just Eat)',
        'Loyalty program setup và customer retention strategy',
        'Post-launch support: monitoring, optimization, và ongoing consultation'
      ],

      b2bPricing: 'Từ £17,500 - £40,000',
      b2bPricingNote: 'Tùy chỉnh theo quy mô và nhu cầu',
      b2bCta: 'Nhận tư vấn miễn phí',

      // B2C Services - Individual Courses
      coursesLabel: 'Khóa học cá nhân',
      coursesHeading: 'Các khóa học Bonu cung cấp',
      coursesSubheading: 'Học công thức từ A-Z, được hỗ trợ đến khi thành công',

      // Courses table
      tableCourse: 'Khóa học',
      tablePrice: 'Giá',
      tableDuration: 'Thời lượng',
      tableLevel: 'Cấp độ',
      tableIncluded: 'Bao gồm',

      course1Name: 'Bông lan trứng muối',
      course1Price: 'Liên hệ',
      course1Duration: '2-3 buổi',
      course1Level: 'Trung cấp',
      course1Included: '• Recipe PDF chi tiết từng bước với hình ảnh minh họa • Video call 1-1 live demo và troubleshooting • Nguyên liệu premium 5 sao: trứng muối chất lượng cao, bột cake flour Nhật • Bí quyết tạo độ xốp mịn hoàn hảo không bị xẹp • Kỹ thuật folding bột không làm mất khí • Temperature & timing chính xác cho từng loại lò • Hỗ trợ unlimited qua WhatsApp đến khi thành công • Tips bảo quản và đóng gói professional • Pricing strategy cho bán lẻ hoặc wholesale',

      course2Name: 'Mastery Bếp Việt',
      course2Price: 'Liên hệ',
      course2Duration: '1-2 tháng',
      course2Level: 'Mọi cấp độ',
      course2Included: '• 20+ recipes combo set: phở, bún, cơm, bánh mì, chả giò, nước mắm chuẩn vị • SOP training chi tiết: chuẩn hóa quy trình từ prep đến plating • Không phụ thuộc đầu bếp: recipes & SOPs ai cũng làm được • Scaling recipes cho production: từ 10 phần lên 100+ phần không sai tỷ lệ • Food cost control: tính toán chi phí nguyên liệu chính xác • Pricing strategy: định giá competitive nhưng profitable • Supplier sourcing: list nhà cung cấp nguyên liệu Việt tại UK • Menu engineering: món nào profit cao, món nào làm signature • Kitchen setup consultation: thiết bị cần thiết và layout hiệu quả',

      course3Name: 'Tư vấn công thức 1-1',
      course3Price: 'Tùy chỉnh',
      course3Duration: 'Linh hoạt',
      course3Level: 'Mọi cấp độ',
      course3Included: '• Recipe testing & refinement: test công thức nhiều lần đến khi perfect • Video tutorials chi tiết: quay video step-by-step riêng cho bạn • Support liên tục qua WhatsApp: trả lời mọi câu hỏi 24/7 • Adapt recipes cho local ingredients: thay thế nguyên liệu Việt bằng UK ingredients • Troubleshooting unlimited: fix mọi vấn đề gặp phải không giới hạn • Business setup advice: từ licensing, food safety đến marketing • Cost analysis: tính toán chi phí và lợi nhuận dự kiến • Supplier connections: giới thiệu suppliers uy tín với giá tốt • Packaging & branding guidance: thiết kế bao bì và thương hiệu chuyên nghiệp',

      // Business Models
      modelsLabel: 'Mô hình kinh doanh',
      modelsHeading: 'Mô hình Bonu hỗ trợ thiết lập',
      modelsSubheading: 'Setup nhanh, dễ vận hành, sẵn sàng mở rộng',

      model1Title: 'Korean Street Food',
      model1Desc: 'Mô hình dễ vận hành: Corndog, Bibimbap, Kimbap, Ramen, Gà chiên',
      model1Features: ['Menu tối ưu chi phí', 'Quy trình gọn', 'Phù hợp nhân sự mỏng'],

      model2Title: 'Vietnamese Café',
      model2Desc: 'Cà phê Việt Nam chính hiệu với menu đồ uống và ăn nhẹ',
      model2Features: ['Concept hoàn chỉnh', 'Menu cà phê + bánh', 'Branding & marketing'],

      model3Title: 'Bánh mì Shop',
      model3Desc: 'Tiệm bánh mì với pate, thịt nguội, chả - combo set đầy đủ',
      model3Features: ['Full combo recipes', 'Setup nhà bếp nhỏ', 'Dễ chuẩn hóa'],

      // Business Models table
      tableModel: 'Mô hình',
      tableCost: 'Chi phí',
      tableBreakeven: 'Hòa vốn',
      tableBenefits: 'Lợi ích',
      tableTimeline: 'Thời gian',
      model1Name: 'Korean Street Food',
      model1Cost: '£15,000 - £25,000',
      model1Breakeven: '6-9 tháng',
      model1Benefits: '• Menu 5-7 món dễ train nhân viên trong 1-2 tuần • Quy trình nhanh gọn: prep sáng, service trưa-tối • Chỉ cần 2-3 nhân sự cho 50-80 orders/ngày • Food cost 28-32%: margin cao nhờ ingredients đơn giản • Profit margin 65-70% sau deduct all costs • Popular với Gen Z: trendy, Instagram-friendly, delivery-ready • Equipment investment thấp: fryer, grill, rice cooker chính • Suppliers dễ tìm: hầu hết nguyên liệu có sẵn tại Asian supermarkets • Scaling dễ: standardized recipes, simple operations',
      model1Timeline: '4-6 tuần setup',
      model2Name: 'Vietnamese Café',
      model2Cost: '£20,000 - £35,000',
      model2Breakeven: '8-12 tháng',
      model2Benefits: '• Thương hiệu độc đáo: Vietnamese coffee culture với authentic experience • Repeat customers 60-70%: khách trung thành uống hàng ngày • Community hub: không gian social gathering, loyal customer base • Bubble tea upsell: margin 75-80%, popular với mọi độ tuổi • Profit margin 70-75%: coffee & tea có cost thấp nhưng giá bán cao • Instagram-worthy aesthetic: thiết kế đẹp tự động marketing • All-day trading: breakfast coffee, lunch, afternoon tea • Delivery-friendly: drinks travel well, expands customer reach • Seasonal menu potential: new drinks create buzz & repeat visits',
      model2Timeline: '8-10 tuần setup',
      model3Name: 'Bánh mì Shop',
      model3Cost: '£10,000 - £18,000',
      model3Breakeven: '4-6 tháng',
      model3Benefits: '• Setup nhỏ gọn: chỉ cần 200-300 sq ft space là đủ • Profit margin 75-80%: bánh mì cost £1.50, bán £6-8 • Quick turnaround: 1 bánh mì 3-5 phút, phục vụ nhanh • Lunch rush goldmine: peak 11am-2pm có thể bán 80-120 bánh • Low overhead: ít nhân sự, không cần full kitchen • Easy to scale: mở thêm location với same model dễ dàng • Prep efficiency: chuẩn bị ingredients sáng, assemble khi order • Loyal customer base: người UK yêu bánh mì authentic • Catering opportunity: corporate lunch orders, events',
      model3Timeline: '3-4 tuần setup',

      mindsetTitle: 'Không chỉ là công thức: tư duy vận hành F&B',
      mindsetPara1: 'Khi bạn đến với Bo, bạn không chỉ học công thức. Bạn còn được hướng dẫn tư duy làm nghề trong ngành F&B để triển khai bền vững – dù vận hành nhà hàng hay bán online. Bên cạnh kỹ năng nấu ngon, bạn cần: hiểu khách hàng và xây dựng khách hàng trung thành; quản lý và tạo động lực cho nhân sự; quản trị hàng hóa/nguyên liệu và kiểm soát chi phí; thiết lập SOP, checklist chất lượng; và để mỗi món "nói" đúng câu chuyện thương hiệu của bạn. Đó là nền tảng giúp bạn phát triển lâu dài.',
      mindsetPara2: 'Không có mô hình nào đảm bảo 100% thành công ngay lập tức. Bo cũng đã từng vấp ngã và học lại. Nhưng bạn không phải đi một mình: khi gặp lỗi, Bo ở cạnh để hỗ trợ kịp thời, tìm nguyên nhân, sửa ngay nước đi sai, giúp bạn giảm thiểu sai lầm, tiết kiệm thời gian và tối ưu chi phí trên chặng đường triển khai.',


      faqLabel: 'FAQ',
      faqHeading: 'Câu hỏi thường gặp',
      ctaHeading: 'Sẵn sàng bắt đầu?',
      ctaText: 'Liên hệ ngay để được tư vấn miễn phí. Bo sẽ trả lời tất cả câu hỏi của bạn và tìm hiểu xem dịch vụ nào phù hợp nhất.',
      ctaButton: 'Nhắn tin qua Facebook',
      ctaHomeButton: 'Quay về trang chủ',
      ctaDisclaimer: '*Số lượng dự án có hạn để đảm bảo chất lượng dịch vụ',
    },
    en: {
      // Hero section
      heroLabel: 'Professional Consulting',
      heroHeading: 'Culinary & F&B Operations Consulting',
      heroSubheading: 'From recipes to complete restaurant operations - We partner with you on every journey',
      heroCatchphrase: 'From Top-Notch Recipes to Thriving Franchises',
      heroCta1: 'Business Consulting',
      heroCta2: 'Individual Courses',

      // Credentials section
      credentialsLabel: 'Experience & Credentials',
      credentialsHeading: 'Trained by world-class institutions',
      credential1Title: 'Le Cordon Bleu',
      credential1Text: 'Formally trained at Le Cordon Bleu - the world\'s leading culinary school. Mastered classic French techniques, patisserie artistry, and international food safety standards. Grand Diplôme certification ensures the highest quality training and expertise.',
      credential2Title: '5-Star Hotels',
      credential2Text: 'Over 5 years of experience working in kitchens of 5-star hotels and Michelin-starred restaurants. Expert in large-scale kitchen management, strict quality control, and maintaining premium service standards. Deep understanding of professional F&B operations from the inside out.',
      credential3Title: '10+ Years Experience',
      credential3Text: 'Over 10 years researching and developing recipes in the F&B industry. Created hundreds of standardized recipes, rigorously tested and optimized for scale production. Deep expertise in refining traditional recipes and developing new dishes suited to contemporary markets.',
      credential4Title: 'Global Clientele',
      credential4Text: 'Successfully consulted for clients from Norway, France, USA, Australia, UK and many other countries. Expert in adapting recipes for local ingredients, adjusting to cultural tastes, and building operational processes suitable for each market. Effective remote support via video calls and detailed documentation.',

      // Case Studies section
      caseStudiesLabel: 'Success Stories',
      caseStudiesHeading: 'Proven Track Record',
      caseStudy1Title: 'Wow Banh Mi - Manchester',
      caseStudy1Desc: 'Comprehensive consulting for Vietnamese restaurant in Ancoats, from developing bánh mì and phở recipes to establishing standardized operational processes',
      caseStudy1Detail: 'Results: Featured by Manchester Evening News in "30 best restaurants you need to try in 2025". Achieved 4.9/5 rating with over 500 reviews. Their bánh mì with "light, airy baguettes" and house-made sauces has created "a notable lunchtime following", becoming a Vietnamese food icon on Oldham Road.',
      caseStudy2Title: 'Memoire Saigon - Saundersfoot',
      caseStudy2Desc: 'Consulted on upscale Vietnamese restaurant concept in a Welsh coastal town',
      caseStudy2Detail: 'Results: Brought authentic Vietnamese cuisine to Saundersfoot, creating a unique cultural landmark in the local community',
      caseStudy3Title: '',
      caseStudy3Desc: '',
      caseStudy3Detail: '',

      // Services section
      sectionLabel: 'Services',
      heading: 'Consultation Packages',
      subheading: 'From learning recipes to complete restaurant launch',

      // B2B Services
      b2bLabel: 'B2B Services - Complete Restaurant Consulting',
      b2bHeading: 'Turnkey Solutions for Restaurants & Cafés',

      service1Title: 'Concept Development & Strategy',
      service1Desc: 'Build a solid foundation for your restaurant from initial idea to detailed business strategy. Market analysis, competitive research, and USP identification to create sustainable competitive advantage.',
      service1Items: [
        'Market research and local competitor analysis',
        'Unique restaurant concept development aligned with target market',
        'Detailed business plan with 3-5 year financial projections',
        'ROI and breakeven point analysis',
        'Menu development with cost analysis and optimized profit margins',
        'Competitive pricing strategy based on food cost and market',
        'Target customer identification and positioning strategy'
      ],

      service2Title: 'Comprehensive Design',
      service2Desc: 'Professional design from kitchen to customer space, ensuring efficient workflow and optimal experience. Includes brand design, menus, and website to create a strong impression.',
      service2Items: [
        'Professional kitchen layout design optimizing workflow and productivity',
        'Kitchen equipment selection fitting budget and operational needs',
        'Professional menu design (print & digital formats)',
        'Website design with integrated online ordering and payment gateway',
        'Kitchen and bar space design for maximum efficiency',
        'Branding package: logo, color scheme, typography',
        'Takeaway and delivery packaging design'
      ],

      service3Title: 'Operations & Systems',
      service3Desc: 'Build standardized operational systems for efficient and consistent restaurant performance. From detailed SOPs to inventory management and cost control, ensuring all processes are optimized.',
      service3Items: [
        'Detailed SOP (Standard Operating Procedures) for all positions',
        'EPOS system setup (Square, Toast, or similar)',
        'Inventory management and ordering system with par levels',
        'Recipe costing and menu engineering to optimize profits',
        'Food cost and labor cost control with KPI tracking',
        'Daily, weekly, and monthly reporting systems',
        'Quality checklists and food safety compliance',
        'Supplier management and negotiation support'
      ],

      service4Title: 'Staff Training',
      service4Desc: 'Comprehensive training for your team from cooking techniques, professional service to effective management. Ensuring your team is ready to deliver excellent customer experience from day one.',
      service4Items: [
        'Cooking techniques and dish preparation training with standardized recipes',
        'Food safety, hygiene, and allergen awareness training',
        'Service excellence training: customer service and upselling techniques',
        'Till training and EPOS system operation',
        'Management training: shift management, staff scheduling, inventory',
        'Team building and creating positive work culture',
        'Grand opening support: soft launch planning and execution',
        'On-site support during the first week of opening'
      ],

      service5Title: 'Sales & Marketing',
      service5Desc: 'Comprehensive marketing strategy to create buzz before launch and maintain momentum after. From digital advertising to social media management, we help you reach and retain customers effectively.',
      service5Items: [
        'Overall marketing & branding strategy',
        'Pre-launch marketing campaign: creating buzz before opening',
        'Google Ads setup and management with budget optimization',
        'Facebook/Instagram Ads setup and management targeting local audience',
        'Daily social media management (3 months): content creation, posting, engagement',
        'Photography and videography for menu items and space',
        'Google My Business setup and review management strategy',
        'Partnership setup with food delivery platforms (Deliveroo, Uber Eats, Just Eat)',
        'Loyalty program setup and customer retention strategy',
        'Post-launch support: monitoring, optimization, and ongoing consultation'
      ],

      b2bPricing: 'From £17,500 - £40,000',
      b2bPricingNote: 'Customized based on scope and needs',
      b2bCta: 'Get Free Consultation',

      // B2C Services - Individual Courses
      coursesLabel: 'Individual Courses',
      coursesHeading: 'Courses We Provide',
      coursesSubheading: 'Learn recipes from A-Z, supported until you succeed',

      // Courses table
      tableCourse: 'Course',
      tablePrice: 'Price',
      tableDuration: 'Duration',
      tableLevel: 'Level',
      tableIncluded: 'Included',

      course1Name: 'Salted Egg Sponge Cake',
      course1Price: 'Contact',
      course1Duration: '2-3 sessions',
      course1Level: 'Intermediate',
      course1Included: '• Detailed step-by-step recipe PDF with illustrated images • 1-1 video call live demo and troubleshooting • Premium 5-star ingredients: high-quality salted eggs, Japanese cake flour • Secrets to achieve perfect fluffy texture without collapsing • Folding technique without losing air bubbles • Precise temperature & timing for different oven types • Unlimited WhatsApp support until success • Professional storage and packaging tips • Pricing strategy for retail or wholesale',

      course2Name: 'Vietnamese Food Mastery',
      course2Price: 'Contact',
      course2Duration: '1-2 months',
      course2Level: 'All levels',
      course2Included: '• 20+ recipe combo set: phở, bún, cơm, bánh mì, spring rolls, authentic fish sauce • Detailed SOP training: standardize process from prep to plating • Chef-independent: recipes & SOPs anyone can execute • Scaling recipes for production: from 10 to 100+ portions without ratio errors • Food cost control: accurate ingredient cost calculations • Pricing strategy: competitive yet profitable pricing • Supplier sourcing: list of Vietnamese ingredient suppliers in UK • Menu engineering: which dishes are profitable, which are signature • Kitchen setup consultation: essential equipment and efficient layout',

      course3Name: '1-on-1 Recipe Consultation',
      course3Price: 'Custom',
      course3Duration: 'Flexible',
      course3Level: 'All levels',
      course3Included: '• Recipe testing & refinement: test recipes multiple times until perfect • Detailed video tutorials: step-by-step videos customized for you • Continuous WhatsApp support: answer all questions 24/7 • Adapt recipes for local ingredients: substitute Vietnamese ingredients with UK alternatives • Unlimited troubleshooting: fix any issues without limits • Business setup advice: from licensing, food safety to marketing • Cost analysis: calculate projected costs and profits • Supplier connections: introduce reliable suppliers with good prices • Packaging & branding guidance: professional packaging and brand design',

      // Business Models
      modelsLabel: 'Business Models',
      modelsHeading: 'Business Models We Support',
      modelsSubheading: 'Quick setup, easy operations, ready to scale',

      model1Title: 'Korean Street Food',
      model1Desc: 'Easy-to-operate model: Corndog, Bibimbap, Kimbap, Ramen, Fried Chicken',
      model1Features: ['Cost-optimized menu', 'Streamlined processes', 'Lean staffing'],

      model2Title: 'Vietnamese Café',
      model2Desc: 'Authentic Vietnamese coffee with beverages and light bites menu',
      model2Features: ['Complete concept', 'Coffee + pastries menu', 'Branding & marketing'],

      model3Title: 'Bánh mì Shop',
      model3Desc: 'Bánh mì shop with pate, cold cuts, cha - complete combo set',
      model3Features: ['Full combo recipes', 'Small kitchen setup', 'Easy to standardize'],

      // Business Models table
      tableModel: 'Model',
      tableCost: 'Investment',
      tableBreakeven: 'Breakeven',
      tableBenefits: 'Benefits',
      tableTimeline: 'Timeline',
      model1Name: 'Korean Street Food',
      model1Cost: '£15,000 - £25,000',
      model1Breakeven: '6-9 months',
      model1Benefits: '• 5-7 dish menu easy to train staff in 1-2 weeks • Quick streamlined process: morning prep, lunch-dinner service • Only need 2-3 staff for 50-80 orders/day • Food cost 28-32%: high margin thanks to simple ingredients • Profit margin 65-70% after all costs deducted • Popular with Gen Z: trendy, Instagram-friendly, delivery-ready • Low equipment investment: fryer, grill, rice cooker mainly • Easy to find suppliers: most ingredients available at Asian supermarkets • Easy to scale: standardized recipes, simple operations',
      model1Timeline: '4-6 weeks setup',
      model2Name: 'Vietnamese Café',
      model2Cost: '£20,000 - £35,000',
      model2Breakeven: '8-12 months',
      model2Benefits: '• Unique brand: Vietnamese coffee culture with authentic experience • Repeat customers 60-70%: loyal customers visit daily • Community hub: social gathering space, loyal customer base • Bubble tea upsell: 75-80% margin, popular with all ages • Profit margin 70-75%: coffee & tea have low cost but high selling price • Instagram-worthy aesthetic: beautiful design creates automatic marketing • All-day trading: breakfast coffee, lunch, afternoon tea • Delivery-friendly: drinks travel well, expands customer reach • Seasonal menu potential: new drinks create buzz & repeat visits',
      model2Timeline: '8-10 weeks setup',
      model3Name: 'Bánh mì Shop',
      model3Cost: '£10,000 - £18,000',
      model3Breakeven: '4-6 months',
      model3Benefits: '• Compact setup: only need 200-300 sq ft space • Profit margin 75-80%: bánh mì costs £1.50, sells £6-8 • Quick turnaround: 1 bánh mì in 3-5 minutes, fast service • Lunch rush goldmine: peak 11am-2pm can sell 80-120 sandwiches • Low overhead: minimal staff, no full kitchen needed • Easy to scale: open more locations with same model easily • Prep efficiency: prepare ingredients in morning, assemble when ordered • Loyal customer base: UK customers love authentic bánh mì • Catering opportunity: corporate lunch orders, events',
      model3Timeline: '3-4 weeks setup',

      mindsetTitle: 'Not just recipes: F&B operational mindset',
      mindsetPara1: 'When you work with Bo, you don\'t just learn recipes. You\'re also guided in developing a professional mindset for the F&B industry to build sustainably – whether running a restaurant or selling online. Beyond cooking skills, you need: understanding customers and building loyal customer base; managing and motivating staff; managing inventory/ingredients and controlling costs; establishing SOPs and quality checklists; and ensuring each dish tells your brand story. That\'s the foundation for long-term growth.',
      mindsetPara2: 'No model guarantees 100% immediate success. Bo has also fallen and learned. But you don\'t walk alone: when you encounter issues, Bo is there to provide timely support, identify root causes, correct mistakes immediately, helping you minimize errors, save time and optimize costs along your implementation journey.',


      faqLabel: 'FAQ',
      faqHeading: 'Frequently Asked Questions',
      ctaHeading: 'Ready to start?',
      ctaText: 'Contact now for free consultation. Bo will answer all your questions and find out which service suits you best.',
      ctaButton: 'Message on Facebook',
      ctaHomeButton: 'Back to Home',
      ctaDisclaimer: '*Limited project capacity to ensure service quality',
    }
  };

  const t = content[currentLang];

  return (
    <>
      <FadeInObserver />
      <main>
        <HeroSection
          heroLabel={t.heroLabel}
          heroHeading={t.heroHeading}
          heroSubheading={t.heroSubheading}
          heroCatchphrase={t.heroCatchphrase}
          heroCta1={t.heroCta1}
          heroCta2={t.heroCta2}
        />
        <CredentialsSection
          credentialsLabel={t.credentialsLabel}
          credentialsHeading={t.credentialsHeading}
          credential1Title={t.credential1Title}
          credential1Text={t.credential1Text}
          credential2Title={t.credential2Title}
          credential2Text={t.credential2Text}
          credential3Title={t.credential3Title}
          credential3Text={t.credential3Text}
          credential4Title={t.credential4Title}
          credential4Text={t.credential4Text}
        />
        <CaseStudiesSection
          caseStudiesLabel={t.caseStudiesLabel}
          caseStudiesHeading={t.caseStudiesHeading}
          caseStudy1Title={t.caseStudy1Title}
          caseStudy1Desc={t.caseStudy1Desc}
          caseStudy1Detail={t.caseStudy1Detail}
          caseStudy2Title={t.caseStudy2Title}
          caseStudy2Desc={t.caseStudy2Desc}
          caseStudy2Detail={t.caseStudy2Detail}
          caseStudy3Title={t.caseStudy3Title}
          caseStudy3Desc={t.caseStudy3Desc}
          caseStudy3Detail={t.caseStudy3Detail}
        />
        <B2BServicesSection
          b2bLabel={t.b2bLabel}
          b2bHeading={t.b2bHeading}
          service1Title={t.service1Title}
          service1Desc={t.service1Desc}
          service1Items={t.service1Items}
          service2Title={t.service2Title}
          service2Desc={t.service2Desc}
          service2Items={t.service2Items}
          service3Title={t.service3Title}
          service3Desc={t.service3Desc}
          service3Items={t.service3Items}
          service4Title={t.service4Title}
          service4Desc={t.service4Desc}
          service4Items={t.service4Items}
          service5Title={t.service5Title}
          service5Desc={t.service5Desc}
          service5Items={t.service5Items}
          b2bPricing={t.b2bPricing}
          b2bPricingNote={t.b2bPricingNote}
          b2bCta={t.b2bCta}
        />
        <CoursesSection
          coursesLabel={t.coursesLabel}
          coursesHeading={t.coursesHeading}
          coursesSubheading={t.coursesSubheading}
          tableCourse={t.tableCourse}
          tablePrice={t.tablePrice}
          tableDuration={t.tableDuration}
          tableLevel={t.tableLevel}
          tableIncluded={t.tableIncluded}
          course1Name={t.course1Name}
          course1Price={t.course1Price}
          course1Duration={t.course1Duration}
          course1Level={t.course1Level}
          course1Included={t.course1Included}
          course2Name={t.course2Name}
          course2Price={t.course2Price}
          course2Duration={t.course2Duration}
          course2Level={t.course2Level}
          course2Included={t.course2Included}
          course3Name={t.course3Name}
          course3Price={t.course3Price}
          course3Duration={t.course3Duration}
          course3Level={t.course3Level}
          course3Included={t.course3Included}
        />
        <BusinessModelsSection
          modelsLabel={t.modelsLabel}
          modelsHeading={t.modelsHeading}
          modelsSubheading={t.modelsSubheading}
          tableModel={t.tableModel}
          tableCost={t.tableCost}
          tableBreakeven={t.tableBreakeven}
          tableBenefits={t.tableBenefits}
          tableTimeline={t.tableTimeline}
          model1Name={t.model1Name}
          model1Cost={t.model1Cost}
          model1Breakeven={t.model1Breakeven}
          model1Benefits={t.model1Benefits}
          model1Timeline={t.model1Timeline}
          model2Name={t.model2Name}
          model2Cost={t.model2Cost}
          model2Breakeven={t.model2Breakeven}
          model2Benefits={t.model2Benefits}
          model2Timeline={t.model2Timeline}
          model3Name={t.model3Name}
          model3Cost={t.model3Cost}
          model3Breakeven={t.model3Breakeven}
          model3Benefits={t.model3Benefits}
          model3Timeline={t.model3Timeline}
        />
        <FAQSection
          faqLabel={t.faqLabel}
          faqHeading={t.faqHeading}
          currentLang={currentLang}
        />
        <ContactFormSection
          ctaHeading={t.ctaHeading}
          ctaText={t.ctaText}
          currentLang={currentLang}
        />
      </main>
    </>
  );
}
