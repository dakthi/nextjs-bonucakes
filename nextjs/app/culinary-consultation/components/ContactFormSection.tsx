'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ContactFormSectionProps {
  ctaHeading: string;
  ctaText: string;
  currentLang: 'vi' | 'en';
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  serviceInterest: 'b2b-consulting' | 'individual-courses' | 'business-setup' | 'other';
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactFormSection({ ctaHeading, ctaText, currentLang }: ContactFormSectionProps) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const translations = {
    en: {
      name: 'Full Name',
      namePlaceholder: 'Your full name',
      email: 'Email Address',
      emailPlaceholder: 'your@email.com',
      phone: 'Phone Number (Optional)',
      phonePlaceholder: '+44 123 456 7890',
      serviceInterest: 'Service Interest',
      servicePlaceholder: 'Select a service',
      message: 'Message',
      messagePlaceholder: 'Tell us about your needs and how we can help...',
      submit: 'Send Inquiry',
      submitting: 'Sending...',
      successTitle: 'Thank You!',
      successMessage: 'Your inquiry has been received. We will get back to you within 24 hours.',
      errorTitle: 'Oops!',
      tryAgain: 'Try Again',
      services: {
        'b2b-consulting': 'B2B Restaurant Consulting',
        'individual-courses': 'Individual Courses',
        'business-setup': 'Business Model Setup',
        'other': 'Other'
      },
      validation: {
        nameRequired: 'Name is required',
        nameMin: 'Name must be at least 2 characters',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email',
        serviceRequired: 'Please select a service',
        messageRequired: 'Message is required',
        messageMin: 'Message must be at least 10 characters'
      }
    },
    vi: {
      name: 'Họ và Tên',
      namePlaceholder: 'Họ và tên của bạn',
      email: 'Địa chỉ Email',
      emailPlaceholder: 'email@example.com',
      phone: 'Số Điện Thoại (Không bắt buộc)',
      phonePlaceholder: '0123 456 789',
      serviceInterest: 'Dịch Vụ Quan Tâm',
      servicePlaceholder: 'Chọn dịch vụ',
      message: 'Tin Nhắn',
      messagePlaceholder: 'Cho chúng tôi biết về nhu cầu của bạn và cách chúng tôi có thể giúp đỡ...',
      submit: 'Gửi Yêu Cầu',
      submitting: 'Đang gửi...',
      successTitle: 'Cảm ơn bạn!',
      successMessage: 'Chúng tôi đã nhận được yêu cầu của bạn. Chúng tôi sẽ liên hệ lại trong vòng 24 giờ.',
      errorTitle: 'Rất tiếc!',
      tryAgain: 'Thử Lại',
      services: {
        'b2b-consulting': 'Tư vấn nhà hàng B2B',
        'individual-courses': 'Khóa học cá nhân',
        'business-setup': 'Thiết lập mô hình kinh doanh',
        'other': 'Khác'
      },
      validation: {
        nameRequired: 'Vui lòng nhập họ tên',
        nameMin: 'Họ tên phải có ít nhất 2 ký tự',
        emailRequired: 'Vui lòng nhập email',
        emailInvalid: 'Email không hợp lệ',
        serviceRequired: 'Vui lòng chọn dịch vụ',
        messageRequired: 'Vui lòng nhập tin nhắn',
        messageMin: 'Tin nhắn phải có ít nhất 10 ký tự'
      }
    }
  };

  const t = translations[currentLang];

  const onSubmit = async (data: ContactFormData) => {
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setStatus('success');
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-primary text-light">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">{ctaHeading}</h2>
        <p className="text-xl text-light/80 mb-12 max-w-2xl mx-auto text-center">{ctaText}</p>

        {status === 'success' ? (
          // Success Message
          <div className="bg-light/10 border-2 border-secondary p-8 rounded-lg text-center animate-fade-in">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-3">{t.successTitle}</h3>
            <p className="text-light/90 text-lg">{t.successMessage}</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 text-secondary hover:text-light transition-colors underline"
            >
              {t.tryAgain}
            </button>
          </div>
        ) : (
          // Contact Form
          <div className="bg-light/10 backdrop-blur-sm border border-secondary/30 p-8 md:p-10 rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-light mb-2">
                  {t.name} <span className="text-secondary">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name', {
                    required: t.validation.nameRequired,
                    minLength: {
                      value: 2,
                      message: t.validation.nameMin
                    }
                  })}
                  className="w-full px-4 py-3 bg-light/95 border border-primary/20 rounded text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder={t.namePlaceholder}
                  disabled={status === 'submitting'}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-secondary">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-light mb-2">
                  {t.email} <span className="text-secondary">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: t.validation.emailRequired,
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t.validation.emailInvalid
                    }
                  })}
                  className="w-full px-4 py-3 bg-light/95 border border-primary/20 rounded text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder={t.emailPlaceholder}
                  disabled={status === 'submitting'}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-secondary">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field (Optional) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-light mb-2">
                  {t.phone}
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className="w-full px-4 py-3 bg-light/95 border border-primary/20 rounded text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  placeholder={t.phonePlaceholder}
                  disabled={status === 'submitting'}
                />
              </div>

              {/* Service Interest Dropdown */}
              <div>
                <label htmlFor="serviceInterest" className="block text-sm font-semibold text-light mb-2">
                  {t.serviceInterest} <span className="text-secondary">*</span>
                </label>
                <select
                  id="serviceInterest"
                  {...register('serviceInterest', {
                    required: t.validation.serviceRequired
                  })}
                  className="w-full px-4 py-3 bg-light/95 border border-primary/20 rounded text-primary focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  disabled={status === 'submitting'}
                >
                  <option value="">{t.servicePlaceholder}</option>
                  <option value="b2b-consulting">
                    {currentLang === 'en'
                      ? 'B2B Restaurant Consulting / Tư vấn nhà hàng B2B'
                      : 'Tư vấn nhà hàng B2B / B2B Restaurant Consulting'
                    }
                  </option>
                  <option value="individual-courses">
                    {currentLang === 'en'
                      ? 'Individual Courses / Khóa học cá nhân'
                      : 'Khóa học cá nhân / Individual Courses'
                    }
                  </option>
                  <option value="business-setup">
                    {currentLang === 'en'
                      ? 'Business Model Setup / Thiết lập mô hình kinh doanh'
                      : 'Thiết lập mô hình kinh doanh / Business Model Setup'
                    }
                  </option>
                  <option value="other">
                    {currentLang === 'en'
                      ? 'Other / Khác'
                      : 'Khác / Other'
                    }
                  </option>
                </select>
                {errors.serviceInterest && (
                  <p className="mt-1 text-sm text-secondary">{errors.serviceInterest.message}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-light mb-2">
                  {t.message} <span className="text-secondary">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message', {
                    required: t.validation.messageRequired,
                    minLength: {
                      value: 10,
                      message: t.validation.messageMin
                    }
                  })}
                  className="w-full px-4 py-3 bg-light/95 border border-primary/20 rounded text-primary placeholder-primary/40 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-vertical"
                  placeholder={t.messagePlaceholder}
                  disabled={status === 'submitting'}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-secondary">{errors.message.message}</p>
                )}
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="bg-secondary/20 border border-secondary/50 p-4 rounded">
                  <p className="text-secondary font-semibold">{t.errorTitle}</p>
                  <p className="text-light/90 text-sm mt-1">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold py-4 px-6 rounded transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.submitting}
                    </span>
                  ) : (
                    t.submit
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
