import type { ReactElement } from 'react'
import { SvgIcon } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { AppRoutes } from '@/config/routes'
import packageJson from '../../../../package.json'
import ExternalLink from '../ExternalLink'

const footerPages = [
  AppRoutes.welcome.index,
  AppRoutes.settings.index,
  AppRoutes.imprint,
  AppRoutes.privacy,
  AppRoutes.cookie,
  AppRoutes.terms,
  AppRoutes.licenses,
]

// const FooterLink = ({ children, href }: { children: ReactNode; href: string }): ReactElement => {
//   return href ? (
//     <Link href={href} passHref legacyBehavior>
//       <MUILink>{children}</MUILink>
//     </Link>
//   ) : (
//     <MUILink>{children}</MUILink>
//   )
// }

const Footer = (): ReactElement | null => {
  const router = useRouter()
  // const isOfficialHost = useIsOfficialHost()

  if (!footerPages.some((path) => router.pathname.startsWith(path))) {
    return null
  }

  // const getHref = (path: string): string => {
  //   return router.pathname === path ? '' : path
  // }

  return (
    <footer className={css.container}>
      <ul>
        {/* {isOfficialHost ? (
          <>
            <li>
              <Typography variant="caption">&copy;2022–{new Date().getFullYear()} Core Contributors GmbH</Typography>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.terms)}>Terms</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.privacy)}>Privacy</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.licenses)}>Licenses</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.imprint)}>Imprint</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.cookie)}>Cookie policy</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.settings.index)}>Preferences</FooterLink>
            </li>
            <li>
              <ExternalLink href={HELP_CENTER_URL} noIcon sx={{ span: { textDecoration: 'underline' } }}>
                Help
              </ExternalLink>
            </li>
          </>
        ) : (
          <li>This is an unofficial distribution of the app</li>
        )} */}

        <li>
          Powered by{' '}
          <ExternalLink href="https://safe.global/" noIcon sx={{ span: { textDecoration: 'underline' } }}>
            Safe
          </ExternalLink>
        </li>

        <li>
          <ExternalLink href={`${packageJson.homepage}/releases/tag/v${packageJson.version}`} noIcon>
            <SvgIcon component={GitHubIcon} inheritViewBox fontSize="inherit" sx={{ mr: 0.5 }} /> v{packageJson.version}
          </ExternalLink>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
