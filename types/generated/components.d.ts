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
    button: Schema.Attribute.Component<'elements.button', false>;
    description: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface CardsFormatCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_format_cards';
  info: {
    description: '';
    displayName: 'Format Card';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.button', false>;
    description: Schema.Attribute.Text;
    features: Schema.Attribute.Component<'elements.list-item', true>;
    image: Schema.Attribute.Media<'images'>;
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
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
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

export interface ElementsButton extends Struct.ComponentSchema {
  collectionName: 'components_elements_buttons';
  info: {
    description: '';
    displayName: 'Button';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['primary_pill', 'secondary', 'outline', 'ghost']
    > &
      Schema.Attribute.DefaultTo<'primary_pill'>;
  };
}

export interface ElementsListItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_list_items';
  info: {
    description: '';
    displayName: 'List Item';
  };
  attributes: {
    text: Schema.Attribute.String;
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
    right_button: Schema.Attribute.Component<'elements.button', false>;
    right_items: Schema.Attribute.Component<'elements.list-item', true>;
    right_title: Schema.Attribute.String;
  };
}

export interface SectionsK12Materials extends Struct.ComponentSchema {
  collectionName: 'components_sections_k12_materials';
  info: {
    description: '';
    displayName: 'K-12 Materials';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.button', false>;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
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
    description: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'cards.course-preview', true>;
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
    title: Schema.Attribute.String;
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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'cards.career-card': CardsCareerCard;
      'cards.course-preview': CardsCoursePreview;
      'cards.format-card': CardsFormatCard;
      'cards.goal-card': CardsGoalCard;
      'cards.hero-slide': CardsHeroSlide;
      'cards.offer-card': CardsOfferCard;
      'cards.program-link': CardsProgramLink;
      'elements.button': ElementsButton;
      'elements.list-item': ElementsListItem;
      'sections.achieve-goals': SectionsAchieveGoals;
      'sections.ai-journey': SectionsAiJourney;
      'sections.categories': SectionsCategories;
      'sections.explore-careers': SectionsExploreCareers;
      'sections.features-grid': SectionsFeaturesGrid;
      'sections.hero-slider': SectionsHeroSlider;
      'sections.institutional-programs': SectionsInstitutionalPrograms;
      'sections.k12-materials': SectionsK12Materials;
      'sections.learn-next': SectionsLearnNext;
      'sections.learning-formats': SectionsLearningFormats;
      'sections.microsoft-spotlight': SectionsMicrosoftSpotlight;
      'sections.practice-exams': SectionsPracticeExams;
    }
  }
}
