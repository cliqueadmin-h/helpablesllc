export const consultationHref = '/contact?tab=booking';

export const offers = [
  {
    id: 'discovery',
    title: 'Workflow discovery',
    subject: 'Workflow discovery inquiry',
    price: '$350',
    basis: 'fixed fee',
    description: 'Map one lead workflow and leave with a prioritized list of fixes, a proposed scope, and a clear next step.',
    linkText: 'Ask about discovery',
  },
  {
    id: 'implementation',
    title: 'Implementation',
    subject: 'Workflow implementation inquiry',
    price: '$1,500+',
    basis: 'per project',
    description: 'Connect the form, CRM, and notifications for one agreed workflow. Includes testing and a handoff your team can use.',
    linkText: 'Discuss implementation',
  },
  {
    id: 'support',
    title: 'Ongoing support',
    subject: 'Workflow support inquiry',
    price: '$500+',
    basis: 'per month',
    description: 'Monitor failures, review response and handoff metrics, and make agreed improvements as the workflow changes.',
    linkText: 'Discuss support',
  },
] as const;

export const capabilities = [
  {
    title: 'Capture inquiries in one place',
    description: 'Connect your website forms to the inbox or CRM your team already uses, with a record of each request.',
  },
  {
    title: 'Make the handoff clear',
    description: 'Assign an owner, send an internal alert, and define when to follow up so new work has a clear next step.',
  },
  {
    title: 'See when something fails',
    description: 'Track delivery status, retry temporary failures safely, and keep a record your team can review.',
  },
] as const;

export function getOffer(id: string | null) {
  return offers.find((offer) => offer.id === id);
}
