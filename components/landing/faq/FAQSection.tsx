import React from 'react';
import { FAQItem } from './FAQItem';

/**
 * FAQ section with expandable items
 */
export default function FAQSection() {
  const faqs = [
    {
      question: 'How does ContentMultiplier.io work?',
      answer:
        'Simply paste a YouTube URL, upload an audio file, or paste text content. Our AI will transcribe the content and generate 10+ optimized formats for different platforms in under 5 minutes.',
    },
    {
      question: 'What content formats do you generate?',
      answer:
        'We generate 10 different formats: 5 Twitter posts, 3 LinkedIn posts, 2 Instagram captions, 1 blog article, 1 email newsletter, 5 quote graphics, 1 Twitter thread, 1 podcast show notes, 1 video script summary, and 5 TikTok/Reels hooks.',
    },
    {
      question: 'How much does it cost?',
      answer:
        'We offer a free plan with 5 credits per month. Paid plans start at $39/month for 50 credits. Each credit generates all 10 content formats from one input.',
    },
    {
      question: 'Is my content secure and private?',
      answer:
        'Yes, absolutely. We use enterprise-grade security and never share your content with third parties. All data is encrypted and processed securely.',
    },
    {
      question: 'Can I customize the generated content?',
      answer:
        'Yes! All generated content is fully editable. You can copy, download, or modify any piece of content to match your brand voice and style.',
    },
    {
      question: 'Do you offer refunds?',
      answer:
        "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied with the service, we'll refund your payment in full.",
    },
  ];

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about ContentMultiplier.io
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
