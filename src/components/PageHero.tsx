import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { HTMLAttributes, ReactNode } from 'react'

type BreadcrumbItem = {
  label: string
  href?: string
  icon?: ReactNode
  iconClassName?: string
  showLabel?: boolean
}

type PageHeroProps = {
  title: string
  description?: string
  eyebrow?: string
  breadcrumbs?: BreadcrumbItem[]
  align?: 'left' | 'center'
  backgroundImage?: string
  imageAlt?: string
  overlayClassName?: string
  heightClassName?: string
  backgroundClassName?: string
  containerClassName?: string
  contentClassName?: string
  className?: string
  contentProps?: HTMLAttributes<HTMLDivElement> & Record<string, unknown>
  breadcrumbWrapperClassName?: string
  breadcrumbInnerClassName?: string
}

export default function PageHero({
  title,
  description,
  eyebrow,
  breadcrumbs,
  align = 'center',
  backgroundImage,
  imageAlt = title,
  overlayClassName = 'bg-black/40',
  heightClassName,
  backgroundClassName,
  containerClassName = 'container-custom',
  contentClassName,
  className,
  contentProps,
  breadcrumbWrapperClassName,
  breadcrumbInnerClassName,
}: PageHeroProps) {
  const hasImage = Boolean(backgroundImage)
  const contentAlignment =
    align === 'center'
      ? 'text-center flex flex-col items-center justify-center'
      : 'text-left flex flex-col justify-center'

  return (
    <>
      <section
        className={clsx(
          hasImage
            ? clsx(
                'relative overflow-hidden',
                heightClassName ?? 'h-[240px] sm:h-[280px] md:h-[320px] lg:h-[380px] xl:h-[440px]'
              )
            : clsx('section-padding', backgroundClassName ?? 'bg-gradient-to-br from-background to-primary/5'),
          className
        )}
      >
        {hasImage && backgroundImage && (
          <>
            <Image src={backgroundImage} alt={imageAlt} fill className="object-cover" priority sizes="100vw" />
            <div className={clsx('absolute inset-0', overlayClassName)} />
          </>
        )}

        <div className={clsx('relative', hasImage && 'h-full')}>
          <div className={clsx(containerClassName, hasImage && 'h-full')}>
            <div
              {...contentProps}
              className={clsx(
                contentAlignment,
                hasImage ? 'h-full max-w-4xl mx-auto px-4' : 'max-w-4xl mx-auto',
                contentClassName,
                contentProps?.className
              )}
            >
              {eyebrow ? (
                <p
                  className={clsx(
                    'uppercase tracking-wider font-bold text-sm sm:text-base lg:text-lg mb-3',
                    hasImage ? 'text-white/80' : 'text-primary-600'
                  )}
                >
                  {eyebrow}
                </p>
              ) : null}
              <h1
                className={clsx(
                  'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold',
                  hasImage ? 'text-white' : 'text-secondary'
                )}
              >
                {title}
              </h1>
              {description && (
                <p
                  className={clsx(
                    'mt-4 text-base sm:text-lg lg:text-xl',
                    hasImage ? 'text-white/90' : 'text-gray-600',
                    align === 'center' ? 'max-w-3xl' : 'max-w-2xl'
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <div
          className={clsx(
            breadcrumbWrapperClassName ?? 'bg-white border-b border-secondary-200'
          )}
        >
          <div className={clsx(containerClassName, 'py-3', breadcrumbInnerClassName)}>
            <nav className="flex items-center space-x-2 text-sm text-secondary-600">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1
                return (
                  <div key={`${crumb.label}-${index}`} className="flex items-center space-x-2">
                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                        {crumb.icon && (
                          <span
                            className={clsx(
                              'w-8 h-8 sm:w-9 sm:h-9 rounded flex items-center justify-center bg-primary-600 text-white',
                              crumb.iconClassName
                            )}
                          >
                            {crumb.icon}
                          </span>
                        )}
                        {crumb.showLabel !== false && <span>{crumb.label}</span>}
                      </Link>
                    ) : (
                      <span
                        className={clsx(
                          'flex items-center gap-2',
                          crumb.showLabel !== false && isLast ? 'font-medium text-secondary-900' : undefined
                        )}
                      >
                        {crumb.icon && (
                          <span
                            className={clsx(
                              'w-8 h-8 sm:w-9 sm:h-9 rounded flex items-center justify-center bg-primary-600 text-white',
                              crumb.iconClassName
                            )}
                          >
                            {crumb.icon}
                          </span>
                        )}
                        {crumb.showLabel !== false && crumb.label}
                      </span>
                    )}
                    {!isLast && <ChevronRight className="h-4 w-4 text-gray-400" />}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

