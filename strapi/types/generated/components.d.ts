import type { Schema, Struct } from '@strapi/strapi';

export interface BenefitAddress extends Struct.ComponentSchema {
  collectionName: 'components_benefit_addresses';
  info: {
    description: 'Address information';
    displayName: 'Address';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    postalCode: Schema.Attribute.String & Schema.Attribute.Required;
    state: Schema.Attribute.String & Schema.Attribute.Required;
    street: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BenefitApplicationFormField extends Struct.ComponentSchema {
  collectionName: 'components_benefit_application_form_fields';
  info: {
    description: 'Application form field details';
    displayName: 'Application Form Field';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    multiple: Schema.Attribute.Boolean;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    options: Schema.Attribute.Component<'benefit.field-option', true>;
    required: Schema.Attribute.Boolean & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['text', 'textarea', 'select', 'date']> &
      Schema.Attribute.Required;
  };
}

export interface BenefitApplicationProcess extends Struct.ComponentSchema {
  collectionName: 'components_benefit_application_processes';
  info: {
    description: 'Application process details';
    displayName: 'Application Process';
  };
  attributes: {
    description_md: Schema.Attribute.Text & Schema.Attribute.Required;
    mode: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BenefitContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_benefit_contact_infos';
  info: {
    description: 'Contact details';
    displayName: 'Contact Information';
  };
  attributes: {
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    phoneNumber: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BenefitDocument extends Struct.ComponentSchema {
  collectionName: 'components_benefit_documents';
  info: {
    description: 'Required documents for the benefit';
    displayName: 'Document';
  };
  attributes: {
    allowedProofs: Schema.Attribute.JSON & Schema.Attribute.Required;
    documentType: Schema.Attribute.Enumeration<
      [
        'associationProof',
        'bankAccountProof',
        'birthProof',
        'casteProof',
        'disabilityProof',
        'feeProof',
        'idProof',
        'incomeProof',
        'janAadhar',
        'marksProof',
        'participationProof',
        'selfDeclarationProof',
      ]
    > &
      Schema.Attribute.Required;
    isRequired: Schema.Attribute.Boolean & Schema.Attribute.Required;
  };
}

export interface BenefitEligibility extends Struct.ComponentSchema {
  collectionName: 'components_benefit_eligibilities';
  info: {
    description: 'Eligibility criteria for the benefit';
    displayName: 'Eligibility';
  };
  attributes: {
    allowedProofs: Schema.Attribute.JSON & Schema.Attribute.Required;
    criteria: Schema.Attribute.Component<
      'benefit.eligibility-criteria',
      false
    > &
      Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    evidence: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['academic', 'demographic', 'economic', 'health', 'misc']
    > &
      Schema.Attribute.Required;
  };
}

export interface BenefitEligibilityCriteria extends Struct.ComponentSchema {
  collectionName: 'components_benefit_eligibility_criteria';
  info: {
    description: 'Specific eligibility criteria';
    displayName: 'Eligibility Criteria';
  };
  attributes: {
    condition: Schema.Attribute.Enumeration<
      ['equals', 'greater than equals', 'less than equals', 'in']
    > &
      Schema.Attribute.Required;
    conditionValues: Schema.Attribute.JSON & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BenefitExclusion extends Struct.ComponentSchema {
  collectionName: 'components_benefit_exclusions';
  info: {
    description: 'Exclusions from the benefit';
    displayName: 'Exclusion';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    description_md: Schema.Attribute.Text;
  };
}

export interface BenefitFieldOption extends Struct.ComponentSchema {
  collectionName: 'components_benefit_field_options';
  info: {
    description: 'Options for form fields';
    displayName: 'Field Option';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BenefitFinancialBenefit extends Struct.ComponentSchema {
  collectionName: 'components_benefit_financial_benefits';
  info: {
    description: 'Financial benefits provided';
    displayName: 'Financial Benefit';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    description_md: Schema.Attribute.Text;
    maxValue: Schema.Attribute.String;
    minValue: Schema.Attribute.String;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['financial']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'financial'>;
  };
}

export interface BenefitNonMonetaryBenefit extends Struct.ComponentSchema {
  collectionName: 'components_benefit_non_monetary_benefits';
  info: {
    description: 'Non-monetary benefits provided';
    displayName: 'Non-Monetary Benefit';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    description_md: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['non-monetary']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'non-monetary'>;
  };
}

export interface BenefitProvidingEntity extends Struct.ComponentSchema {
  collectionName: 'components_benefit_providing_entities';
  info: {
    description: 'Entity providing the benefit';
    displayName: 'Providing Entity';
  };
  attributes: {
    address: Schema.Attribute.Component<'benefit.address', false> &
      Schema.Attribute.Required;
    contactInfo: Schema.Attribute.Component<'benefit.contact-info', false> &
      Schema.Attribute.Required;
    department: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['government', 'private', 'individual']
    > &
      Schema.Attribute.Required;
  };
}

export interface BenefitReference extends Struct.ComponentSchema {
  collectionName: 'components_benefit_references';
  info: {
    description: 'References for the benefit';
    displayName: 'Reference';
  };
  attributes: {
    link: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BenefitSponsoringEntity extends Struct.ComponentSchema {
  collectionName: 'components_benefit_sponsoring_entities';
  info: {
    description: 'Entity sponsoring the benefit';
    displayName: 'Sponsoring Entity';
  };
  attributes: {
    address: Schema.Attribute.Component<'benefit.address', false> &
      Schema.Attribute.Required;
    contactInfo: Schema.Attribute.Component<'benefit.contact-info', false> &
      Schema.Attribute.Required;
    department: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    sponsorShare: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['government', 'private', 'individual']
    > &
      Schema.Attribute.Required;
  };
}

export interface TagsTag extends Struct.ComponentSchema {
  collectionName: 'components_tags_tags';
  info: {
    description: 'Tags to help categorize or filter the benefit';
    displayName: 'Tag';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'benefit.address': BenefitAddress;
      'benefit.application-form-field': BenefitApplicationFormField;
      'benefit.application-process': BenefitApplicationProcess;
      'benefit.contact-info': BenefitContactInfo;
      'benefit.document': BenefitDocument;
      'benefit.eligibility': BenefitEligibility;
      'benefit.eligibility-criteria': BenefitEligibilityCriteria;
      'benefit.exclusion': BenefitExclusion;
      'benefit.field-option': BenefitFieldOption;
      'benefit.financial-benefit': BenefitFinancialBenefit;
      'benefit.non-monetary-benefit': BenefitNonMonetaryBenefit;
      'benefit.providing-entity': BenefitProvidingEntity;
      'benefit.reference': BenefitReference;
      'benefit.sponsoring-entity': BenefitSponsoringEntity;
      'tags.tag': TagsTag;
    }
  }
}
