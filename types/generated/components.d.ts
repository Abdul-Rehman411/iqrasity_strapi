import type { Schema, Struct } from '@strapi/strapi';

export interface CardsCareerCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_career_cards';
  info: {
    description: '';
    displayName: 'Career Card';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CardsCoursePreview extends Struct.ComponentSchema {
  collectionName: 'components_cards_course_previews';
  info: {
    description: '';
    displayName: 'Course Preview';
  };
  attributes: {
    courses: Schema.Attribute.Relation<'oneToMany', 'api::course.course'>;
  };
}

export interface CardsFormatCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_format_cards';
  info: {
    description: '';
    displayName: 'Format Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    features: Schema.Attribute.Component<'elements.list-item', true>;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CardsGoalCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_goal_cards';
  info: {
    description: '';
    displayName: 'Goal Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CardsHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_cards_hero_slides';
  info: {
    description: '';
    displayName: 'Hero Slide';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'elements.button', true>;
    description: Schema.Attribute.Text;
    features: Schema.Attribute.Component<'elements.list-item', true>;
    image: Schema.Attribute.Media<'images'>;
    layout: Schema.Attribute.Enumeration<
      [
        'odoo_standard',
        'odoo_three_col',
        'odoo_promo_reverse',
        'custom_modern_split',
        'odoo_centered_minimal',
        'custom_cinematic',
        'odoo_split_blue_dark',
      ]
    > &
      Schema.Attribute.DefaultTo<'odoo_standard'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CardsOfferCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_offer_cards';
  info: {
    description: '';
    displayName: 'Offer Card';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }>;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CardsPerson extends Struct.ComponentSchema {
  collectionName: 'components_cards_people';
  info: {
    description: 'Team member or alumni profile';
    displayName: 'Person';
  };
  attributes: {
    bio: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String;
    social_links: Schema.Attribute.Component<'elements.button', true>;
  };
}

export interface CardsProgramLink extends Struct.ComponentSchema {
  collectionName: 'components_cards_program_links';
  info: {
    description: '';
    displayName: 'Program Link';
  };
  attributes: {
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface CardsStatCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_stat_cards';
  info: {
    description: 'A statistic card with icon, value, and label';
    displayName: 'Stat Card';
    icon: 'chart-pie';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Schema.Attribute.Required;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Active Users'>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'100+'>;
  };
}

export interface CardsTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_cards_team_members';
  info: {
    description: 'Team member card with name, role, and image';
    displayName: 'Team Member';
    icon: 'user';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String;
  };
}

export interface CardsTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_cards_testimonials';
  info: {
    description: 'User testimonial card';
    displayName: 'Testimonial';
    icon: 'quote-right';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    role: Schema.Attribute.String;
  };
}

export interface ElementsBenefitCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_benefit_cards';
  info: {
    description: 'Card with Icon, Title and Description';
    displayName: 'Benefit Card';
    icon: 'check';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsButton extends Struct.ComponentSchema {
  collectionName: 'components_elements_buttons';
  info: {
    description: '';
    displayName: 'Button';
  };
  attributes: {
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['primary_pill', 'secondary', 'outline', 'ghost']
    > &
      Schema.Attribute.DefaultTo<'primary_pill'>;
  };
}

export interface ElementsFeature extends Struct.ComponentSchema {
  collectionName: 'components_elements_features';
  info: {
    description: 'Simple feature item with title and description';
    displayName: 'Feature';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icons: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsIconTextItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_icon_text_items';
  info: {
    description: 'Simple icon and text pair';
    displayName: 'Icon Text Item';
    icon: 'star';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsLinkChip extends Struct.ComponentSchema {
  collectionName: 'components_elements_link_chips';
  info: {
    description: 'A scrollable keyword chip with a link';
    displayName: 'Link Chip';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['default', 'gradient', 'outline']> &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface ElementsListItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_list_items';
  info: {
    description: 'Simple text item for lists';
    displayName: 'List Item';
    icon: 'list';
  };
  attributes: {
    link: Schema.Attribute.String;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsMetaTag extends Struct.ComponentSchema {
  collectionName: 'components_elements_meta_tags';
  info: {
    description: 'Ordered tag for course card';
    displayName: 'Meta Tag';
    icon: 'tag';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['level', 'duration', 'certificate', 'other']
    > &
      Schema.Attribute.DefaultTo<'other'>;
  };
}

export interface ElementsQaPair extends Struct.ComponentSchema {
  collectionName: 'components_elements_qa_pairs';
  info: {
    description: 'Question and Answer';
    displayName: 'QA Pair';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsStudentReview extends Struct.ComponentSchema {
  collectionName: 'components_elements_student_reviews';
  info: {
    description: 'Review with user details and time ago';
    displayName: 'Student Review';
    icon: 'user';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    comment: Schema.Attribute.Text & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    rating: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    time_ago_unit: Schema.Attribute.Enumeration<
      ['Days', 'Weeks', 'Months', 'Years']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Days'>;
    time_ago_val: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface ElementsVideoItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_video_items';
  info: {
    description: 'Video Title and URL';
    displayName: 'Video Item';
    icon: 'play';
  };
  attributes: {
    Video_link: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
  };
}

export interface SectionsAchieveGoals extends Struct.ComponentSchema {
  collectionName: 'components_sections_achieve_goals';
  info: {
    description: '';
    displayName: 'Achieve Goals';
  };
  attributes: {
    items: Schema.Attribute.Component<'cards.goal-card', true>;
  };
}

export interface SectionsAdvantageGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_advantage_grids';
  info: {
    description: 'Iqrasity Advantage Section';
    displayName: 'Advantage Grid';
    icon: 'check-circle';
  };
  attributes: {
    description: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'cards.offer-card', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Iqrasity Advantage'>;
  };
}

export interface SectionsAiJourney extends Struct.ComponentSchema {
  collectionName: 'components_sections_ai_journeys';
  info: {
    description: '';
    displayName: 'AI Journey';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.button', false>;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsCategories extends Struct.ComponentSchema {
  collectionName: 'components_sections_categories';
  info: {
    description: '';
    displayName: 'Categories';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface SectionsContactForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_forms';
  info: {
    description: 'Contact form block';
    displayName: 'Contact Form';
  };
  attributes: {
    description: Schema.Attribute.Text;
    email_placeholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'your@email.com'>;
    submit_label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Send Message'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsEnterpriseSolutions extends Struct.ComponentSchema {
  collectionName: 'components_sections_enterprise_solutions';
  info: {
    description: '';
    displayName: 'Enterprise Solutions';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.button', false>;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsExploreCareers extends Struct.ComponentSchema {
  collectionName: 'components_sections_explore_careers';
  info: {
    description: '';
    displayName: 'Explore Careers';
  };
  attributes: {
    cta_link: Schema.Attribute.Component<'elements.button', false>;
    items: Schema.Attribute.Component<'cards.career-card', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_sections';
  info: {
    description: 'List of FAQs';
    displayName: 'FAQ Section';
    icon: 'question';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.qa-pair', true>;
  };
}

export interface SectionsFeaturesGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_features_grids';
  info: {
    description: '';
    displayName: 'Features Grid';
  };
  attributes: {
    items: Schema.Attribute.Component<'cards.offer-card', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsGalleryGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_gallery_grids';
  info: {
    description: 'Grid of images';
    displayName: 'Gallery Grid';
  };
  attributes: {
    images: Schema.Attribute.Media<'images' | 'videos', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_sections';
  info: {
    description: 'Reusable hero section for pages';
    displayName: 'Hero Section';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsHeroSlider extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_sliders';
  info: {
    description: '';
    displayName: 'Hero Slider';
  };
  attributes: {
    slides: Schema.Attribute.Component<'cards.hero-slide', true>;
  };
}

export interface SectionsInstitutionalPrograms extends Struct.ComponentSchema {
  collectionName: 'components_sections_institutional_programs';
  info: {
    description: '';
    displayName: 'Institutional Programs';
  };
  attributes: {
    left_button: Schema.Attribute.Component<'elements.button', false>;
    left_items: Schema.Attribute.Component<'elements.list-item', true>;
    left_title: Schema.Attribute.String;
    left_title_link: Schema.Attribute.String;
    right_button: Schema.Attribute.Component<'elements.button', false>;
    right_items: Schema.Attribute.Component<'elements.list-item', true>;
    right_title: Schema.Attribute.String;
    right_title_link: Schema.Attribute.String;
  };
}

export interface SectionsInstructor extends Struct.ComponentSchema {
  collectionName: 'components_sections_instructors';
  info: {
    displayName: 'Instructor';
  };
  attributes: {
    instructor_profile: Schema.Attribute.Relation<
      'oneToOne',
      'api::instructor.instructor'
    >;
  };
}

export interface SectionsKeywordScroll extends Struct.ComponentSchema {
  collectionName: 'components_sections_keyword_scrolls';
  info: {
    description: 'Infinite scrolling rows of keywords';
    displayName: 'Keyword Scroll';
    icon: 'align-justify';
  };
  attributes: {
    row_one: Schema.Attribute.Component<'elements.link-chip', true>;
    row_two: Schema.Attribute.Component<'elements.link-chip', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsLearnNext extends Struct.ComponentSchema {
  collectionName: 'components_sections_learn_next';
  info: {
    description: '';
    displayName: 'Learn Next';
  };
  attributes: {
    course_categories: Schema.Attribute.Relation<
      'oneToMany',
      'api::course-category.course-category'
    >;
    courses: Schema.Attribute.Relation<'oneToMany', 'api::course.course'>;
    description: Schema.Attribute.Text;
    list_custom_course: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsLearningFormats extends Struct.ComponentSchema {
  collectionName: 'components_sections_learning_formats';
  info: {
    description: '';
    displayName: 'Learning Formats';
  };
  attributes: {
    items: Schema.Attribute.Component<'cards.format-card', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsMediaList extends Struct.ComponentSchema {
  collectionName: 'components_sections_media_lists';
  info: {
    description: 'List of press releases or media items';
    displayName: 'Media List';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.feature', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsMicrosoftSpotlight extends Struct.ComponentSchema {
  collectionName: 'components_sections_microsoft_spotlights';
  info: {
    description: '';
    displayName: 'Microsoft Spotlight';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    programs: Schema.Attribute.Component<'cards.program-link', true>;
    subtitle: Schema.Attribute.String;
    subtitle_link: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsNewsBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_news_banners';
  info: {
    description: '75% Banner + 25% News Feed';
    displayName: 'News Banner';
    icon: 'newspaper';
  };
  attributes: {
    banner_description: Schema.Attribute.Text;
    banner_image: Schema.Attribute.Media<'images'>;
    banner_title: Schema.Attribute.String & Schema.Attribute.Required;
    buttons: Schema.Attribute.Component<'elements.button', true>;
    manual_articles: Schema.Attribute.Relation<
      'oneToMany',
      'api::article.article'
    >;
    news_category: Schema.Attribute.Relation<
      'oneToOne',
      'api::article-category.article-category'
    >;
    news_mode: Schema.Attribute.Enumeration<['latest', 'manual', 'category']> &
      Schema.Attribute.DefaultTo<'latest'>;
    news_title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Latest News'>;
  };
}

export interface SectionsOutcomes extends Struct.ComponentSchema {
  collectionName: 'components_sections_outcomes';
  info: {
    displayName: 'Outcomes';
    icon: 'check';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.list-item', true>;
    outcome_icon: Schema.Attribute.Media<'images'>;
  };
}

export interface SectionsOverview extends Struct.ComponentSchema {
  collectionName: 'components_sections_overviews';
  info: {
    description: 'What you learn, prerequisites, etc.';
    displayName: 'Overview Section';
    icon: 'layout';
  };
  attributes: {
    prerequisites: Schema.Attribute.Component<'elements.list-item', true>;
    promo_banner: Schema.Attribute.Component<'sections.promo-banner', false>;
    skills: Schema.Attribute.Relation<'oneToMany', 'api::skill.skill'>;
    what_you_learn: Schema.Attribute.Component<'elements.icon-text-item', true>;
    what_you_learn_icon: Schema.Attribute.Media<'images'>;
    why_iqrasity: Schema.Attribute.Component<'sections.why-iqrasity', false>;
  };
}

export interface SectionsPartnersMarquee extends Struct.ComponentSchema {
  collectionName: 'components_sections_partners_marquees';
  info: {
    description: 'Infinite scroll of partner logos';
    displayName: 'Partners Marquee';
    icon: 'infinity';
  };
  attributes: {
    description: Schema.Attribute.Text;
    partners: Schema.Attribute.Relation<'oneToMany', 'api::partner.partner'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Our Valued Partners'>;
  };
}

export interface SectionsPracticeExams extends Struct.ComponentSchema {
  collectionName: 'components_sections_practice_exams';
  info: {
    description: '';
    displayName: 'Practice Exams';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.button', false>;
    description: Schema.Attribute.Text;
    highlight: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsPromoBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_promo_banners';
  info: {
    description: 'Visual banner with text';
    displayName: 'Promo Banner';
    icon: 'picture';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    link: Schema.Attribute.String;
  };
}

export interface SectionsReviewsList extends Struct.ComponentSchema {
  collectionName: 'components_sections_reviews_lists';
  info: {
    description: 'List of student reviews';
    displayName: 'Reviews List';
    icon: 'star';
  };
  attributes: {
    reviews: Schema.Attribute.Component<'elements.student-review', true>;
  };
}

export interface SectionsRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_rich_texts';
  info: {
    description: 'Simple rich text block';
    displayName: 'Rich Text';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

export interface SectionsStatsGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_stats_grids';
  info: {
    description: 'Grid of statistic cards';
    displayName: 'Stats Grid';
    icon: 'border-all';
  };
  attributes: {
    items: Schema.Attribute.Component<'cards.stat-card', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Our Credentials'>;
  };
}

export interface SectionsSteps extends Struct.ComponentSchema {
  collectionName: 'components_sections_steps';
  info: {
    description: 'Step-by-step process flow';
    displayName: 'Steps';
  };
  attributes: {
    description: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'elements.feature', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTeamGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_team_grids';
  info: {
    description: 'Grid of team members';
    displayName: 'Team Grid';
  };
  attributes: {
    description: Schema.Attribute.Text;
    members: Schema.Attribute.Component<'cards.person', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTestimonialSlider extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonial_sliders';
  info: {
    description: 'Carousel of testimonials';
    displayName: 'Testimonial Slider';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'cards.testimonial', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'What our students say'>;
  };
}

export interface SectionsWhyIqrasity extends Struct.ComponentSchema {
  collectionName: 'components_sections_why_iqrasities';
  info: {
    description: 'List of benefits';
    displayName: 'Why Iqrasity';
    icon: 'crown';
  };
  attributes: {
    cards: Schema.Attribute.Component<'elements.benefit-card', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'cards.career-card': CardsCareerCard;
      'cards.course-preview': CardsCoursePreview;
      'cards.format-card': CardsFormatCard;
      'cards.goal-card': CardsGoalCard;
      'cards.hero-slide': CardsHeroSlide;
      'cards.offer-card': CardsOfferCard;
      'cards.person': CardsPerson;
      'cards.program-link': CardsProgramLink;
      'cards.stat-card': CardsStatCard;
      'cards.team-member': CardsTeamMember;
      'cards.testimonial': CardsTestimonial;
      'elements.benefit-card': ElementsBenefitCard;
      'elements.button': ElementsButton;
      'elements.feature': ElementsFeature;
      'elements.icon-text-item': ElementsIconTextItem;
      'elements.link-chip': ElementsLinkChip;
      'elements.list-item': ElementsListItem;
      'elements.meta-tag': ElementsMetaTag;
      'elements.qa-pair': ElementsQaPair;
      'elements.student-review': ElementsStudentReview;
      'elements.video-item': ElementsVideoItem;
      'sections.achieve-goals': SectionsAchieveGoals;
      'sections.advantage-grid': SectionsAdvantageGrid;
      'sections.ai-journey': SectionsAiJourney;
      'sections.categories': SectionsCategories;
      'sections.contact-form': SectionsContactForm;
      'sections.enterprise-solutions': SectionsEnterpriseSolutions;
      'sections.explore-careers': SectionsExploreCareers;
      'sections.faq-section': SectionsFaqSection;
      'sections.features-grid': SectionsFeaturesGrid;
      'sections.gallery-grid': SectionsGalleryGrid;
      'sections.hero-section': SectionsHeroSection;
      'sections.hero-slider': SectionsHeroSlider;
      'sections.institutional-programs': SectionsInstitutionalPrograms;
      'sections.instructor': SectionsInstructor;
      'sections.keyword-scroll': SectionsKeywordScroll;
      'sections.learn-next': SectionsLearnNext;
      'sections.learning-formats': SectionsLearningFormats;
      'sections.media-list': SectionsMediaList;
      'sections.microsoft-spotlight': SectionsMicrosoftSpotlight;
      'sections.news-banner': SectionsNewsBanner;
      'sections.outcomes': SectionsOutcomes;
      'sections.overview': SectionsOverview;
      'sections.partners-marquee': SectionsPartnersMarquee;
      'sections.practice-exams': SectionsPracticeExams;
      'sections.promo-banner': SectionsPromoBanner;
      'sections.reviews-list': SectionsReviewsList;
      'sections.rich-text': SectionsRichText;
      'sections.stats-grid': SectionsStatsGrid;
      'sections.steps': SectionsSteps;
      'sections.team-grid': SectionsTeamGrid;
      'sections.testimonial-slider': SectionsTestimonialSlider;
      'sections.why-iqrasity': SectionsWhyIqrasity;
    }
  }
}
