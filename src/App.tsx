import { useState, useEffect, useRef, useCallback } from 'react'
import { useTypewriter } from './hooks/useTypewriter'

const SENSITIVITY = 0.8
const VIDEO_SRC = `${import.meta.env.BASE_URL}hero.mp4`

const NAV_LINKS = ['Услуги', 'Dviga', 'Обучение', 'Контакты']

const SERVICES = [
  {
    num: '01',
    title: 'Маркетинговая стратегия',
    desc: 'Где вы сейчас, куда двигаться и как обойти конкурентов',
  },
  {
    num: '02',
    title: 'Консалтинг',
    desc: 'Регулярные сессии — разбираем ситуацию, строим систему',
  },
  {
    num: '03',
    title: 'Маркетинговые исследования',
    desc: 'CustDev, анализ рынка, конкурентная разведка',
  },
  {
    num: '04',
    title: 'Брендинг и позиционирование',
    desc: 'Смыслы, которые помогают продавать дороже',
  },
  {
    num: '05',
    title: 'Разработка сайтов',
    desc: 'Через агентство Dviga — от лендинга до корпоративного портала',
  },
]

const STATS = [
  { value: '13+', label: 'лет в маркетинге' },
  { value: 'MBA', label: 'Univ. of Technologies, Sydney' },
  { value: '3 500+', label: 'подписчиков в Telegram' },
  { value: '№2', label: 'разработчик на Tilda в России' },
]

const WHITE_PILLS = ['Стратегия', 'Консалтинг', 'Исследования', 'Брендинг']

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
      <path
        d="M1.5 8.5V2C1.5 1.72386 1.72386 1.5 2 1.5H8.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevXRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)
  const seekPendingRef = useRef(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [pillsVisible, setPillsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const { displayed, done } = useTypewriter({
    text: 'Помогаю собственникам и руководителям продавать дороже — через стратегию, смыслы и системный маркетинг.',
    speed: 38,
    startDelay: 600,
  })

  useEffect(() => {
    const id = setTimeout(() => setPillsVisible(true), 400)
    return () => clearTimeout(id)
  }, [])

  const handleSeeked = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.001) {
      video.currentTime = targetTimeRef.current
    } else {
      seekPendingRef.current = false
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current
      if (!video || isNaN(video.duration) || video.duration <= 0) return
      const currentX = e.clientX
      if (prevXRef.current === null) {
        prevXRef.current = currentX
        return
      }
      const delta = currentX - prevXRef.current
      prevXRef.current = currentX
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      const newTime = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeOffset))
      targetTimeRef.current = newTime
      if (!seekPendingRef.current) {
        seekPendingRef.current = true
        video.currentTime = newTime
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.addEventListener('seeked', handleSeeked)
    return () => video.removeEventListener('seeked', handleSeeked)
  }, [handleSeeked])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setIsMenuOpen(false)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('dv@dviga.marketing')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* fallback */ }
  }

  return (
    <div className="relative bg-white overflow-x-hidden">

      {/* ── Фоновое видео (fixed, под всем) ─────────────── */}
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: '70% center', zIndex: 0 }}
        muted
        playsInline
        preload="auto"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* ── Мобильный оверлей ────────────────────────────── */}
      <div
        className="fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col justify-center px-8 gap-8 md:hidden"
        style={{
          zIndex: 9,
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          >
            {link}
          </a>
        ))}
        <a
          href="#контакты"
          className="text-[32px] font-medium text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        >
          Написать
        </a>
      </div>

      {/* ── Навбар ───────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[17px] sm:text-[21px] tracking-tight text-black leading-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Тимофей Белоглазов
          </span>
          <span
            className="text-[22px] sm:text-[26px] text-black select-none"
            style={{ letterSpacing: '-0.02em' }}
            aria-hidden="true"
          >
            ✳︎
          </span>
        </div>

        <div className="hidden md:flex items-center text-[20px] text-black">
          {NAV_LINKS.map((link, i) => (
            <span key={link}>
              <a href={`#${link.toLowerCase()}`} className="hover:opacity-60 transition-opacity">
                {link}
              </a>
              {i < NAV_LINKS.length - 1 && <span className="mr-[0.18em]">,</span>}
            </span>
          ))}
        </div>

        <a
          href="#контакты"
          className="hidden md:block text-[20px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Написать
        </a>

        <button
          className="flex md:hidden flex-col gap-[5px] p-1 cursor-pointer"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
        >
          <span
            className="block w-6 h-[2px] bg-black"
            style={{ transform: isMenuOpen ? 'translateY(7px) rotate(45deg)' : 'none', transition: 'transform 300ms' }}
          />
          <span
            className="block w-6 h-[2px] bg-black"
            style={{ opacity: isMenuOpen ? 0 : 1, transition: 'opacity 300ms' }}
          />
          <span
            className="block w-6 h-[2px] bg-black"
            style={{ transform: isMenuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none', transition: 'transform 300ms' }}
          />
        </button>
      </nav>

      {/* ════════════════════════════════════════════════════
          ЭКРАН 1 — HERO
      ════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative h-screen flex flex-col justify-end md:justify-center pb-12 md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div className="max-w-xl relative z-10">

          {/* Размытый интро-лейбл */}
          <p
            className="pointer-events-none select-none mb-5 sm:mb-6 text-black"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              filter: 'blur(4px)',
            }}
          >
            Маркетолог, трекер, основатель Dviga.<br />
            MBA, University of Technologies Sydney.
          </p>

          {/* Тайпрайтер */}
          <p
            className="text-black mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: '54px',
            }}
          >
            {displayed}
            {!done && (
              <span
                className="cursor-blink inline-block bg-black align-middle ml-[2px]"
                style={{ width: '2px', height: '1.1em' }}
                aria-hidden="true"
              />
            )}
          </p>

          {/* Пилюли-кнопки */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {WHITE_PILLS.map((label) => (
              <a
                key={label}
                href="#услуги"
                className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 text-[13px] sm:text-[15px] px-4 sm:px-5 mx-[0.2em] mb-[0.4em]"
                style={{ paddingTop: '0.3em', paddingBottom: '0.3em' }}
              >
                {label}
              </a>
            ))}
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 text-[13px] sm:text-[15px] px-4 sm:px-5 mx-[0.2em] mb-[0.4em] gap-2 sm:gap-3"
              style={{ paddingTop: '0.3em', paddingBottom: '0.3em' }}
              title={copied ? 'Скопировано!' : 'Скопировать email'}
            >
              <span>
                Написать:{' '}
                <span className="underline underline-offset-1">
                  {copied ? 'Скопировано!' : 'dv@dviga.marketing'}
                </span>
              </span>
              <CopyIcon />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ЭКРАН 2 — УСЛУГИ
      ════════════════════════════════════════════════════ */}
      <section
        id="услуги"
        className="relative min-h-screen bg-white flex flex-col justify-center px-5 sm:px-8 md:px-10 py-24"
        style={{ zIndex: 2 }}
      >
        <div className="max-w-4xl w-full mx-auto">

          {/* Заголовок секции */}
          <div className="flex items-baseline justify-between mb-10 sm:mb-14 border-b border-black/10 pb-6">
            <span
              className="text-[clamp(32px,6vw,64px)] text-black leading-none tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Услуги
            </span>
            <span className="text-[13px] sm:text-[15px] text-black/40 tracking-widest uppercase">
              Что я делаю
            </span>
          </div>

          {/* Список услуг */}
          <div>
            {SERVICES.map((s, i) => (
              <div
                key={s.num}
                className="flex items-start gap-6 sm:gap-10 py-5 sm:py-6 group"
                style={{ borderBottom: i < SERVICES.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none' }}
              >
                <span
                  className="text-[12px] text-black/30 pt-[0.3em] w-6 shrink-0"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {s.num}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-10 flex-1">
                  <span
                    className="text-[clamp(18px,3vw,26px)] text-black group-hover:opacity-60 transition-opacity"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {s.title}
                  </span>
                  <span className="text-[14px] sm:text-[16px] text-black/50 sm:text-right max-w-xs">
                    {s.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Статы */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 sm:mt-20 pt-10 border-t border-black/10">
            {STATS.map((stat) => (
              <div key={stat.value} className="flex flex-col gap-1">
                <span
                  className="text-[clamp(28px,4vw,44px)] text-black leading-none tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {stat.value}
                </span>
                <span className="text-[13px] sm:text-[14px] text-black/45 leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Где преподаю */}
          <div className="mt-10 sm:mt-12 pt-8 border-t border-black/10">
            <span className="text-[12px] tracking-widest uppercase text-black/30 block mb-4">
              Обучение и выступления
            </span>
            <p
              className="text-[clamp(16px,2.5vw,22px)] text-black/70 leading-relaxed"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Нетология · Синергия · ВШЭ · ДВФУ · Иннополис ·{' '}
              <span className="text-black/40">Правительство МО · РБК</span>
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          ЭКРАН 3 — КОНТАКТЫ
      ════════════════════════════════════════════════════ */}
      <section
        id="контакты"
        className="relative min-h-screen bg-black flex flex-col justify-between px-5 sm:px-8 md:px-10 pt-24 pb-10"
        style={{ zIndex: 2 }}
      >
        {/* Основной блок */}
        <div className="flex flex-col justify-center flex-1 max-w-3xl">
          <p className="text-[13px] sm:text-[15px] text-white/30 tracking-widest uppercase mb-8">
            Начнём?
          </p>
          <h2
            className="text-[clamp(48px,10vw,120px)] text-white leading-none tracking-tight mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Созвонимся.
          </h2>
          <p
            className="text-[clamp(16px,2.5vw,24px)] text-white/60 mb-12 max-w-lg leading-relaxed"
          >
            Вы рассказываете о ситуации — что хотите изменить или достичь.
            Вместе разберёмся, чем могу помочь.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            {/* Telegram */}
            <a
              href="https://t.me/timbeloglazov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-black rounded-full whitespace-nowrap hover:bg-white/85 transition-colors duration-200 text-[14px] sm:text-[16px] px-5 sm:px-6 gap-2"
              style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.43 13.617l-2.963-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.72.942z"/>
              </svg>
              Написать в Telegram
            </a>

            {/* Email */}
            <a
              href="mailto:dv@dviga.marketing"
              className="inline-flex items-center justify-center text-white bg-transparent border border-white/30 rounded-full whitespace-nowrap hover:border-white transition-colors duration-200 text-[14px] sm:text-[16px] px-5 sm:px-6 gap-2"
              style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}
            >
              dv@dviga.marketing
            </a>
          </div>
        </div>

        {/* Футер */}
        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-12 border-t border-white/10 mt-12">
          <div className="flex items-center gap-2">
            <span
              className="text-[15px] text-white/40"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Тимофей Белоглазов
            </span>
            <span className="text-[18px] text-white/20 select-none">✳︎</span>
          </div>

          <div className="flex items-center gap-6 text-[13px] text-white/30">
            <a
              href="https://dviga.marketing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              Агентство Dviga →
            </a>
            <a
              href="https://t.me/marketingorlife"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              Telegram-канал →
            </a>
          </div>

          <span className="text-[13px] text-white/20">© 2025</span>
        </footer>
      </section>

    </div>
  )
}
