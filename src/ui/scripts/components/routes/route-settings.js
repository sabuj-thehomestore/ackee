import PropTypes from 'prop-types'
import { Fragment, createElement as h } from 'react'

import useDomains from '../../api/hooks/domains/use-domains.js'
import useEvents from '../../api/hooks/events/use-events.js'
import usePermanentTokens from '../../api/hooks/permanent-tokens/use-permanent-tokens.js'
import useDeleteToken from '../../api/hooks/tokens/use-delete-token.js'
import {
  MODALS_DOMAIN_ADD,
  MODALS_DOMAIN_EDIT,
  MODALS_EVENT_ADD,
  MODALS_EVENT_EDIT,
  MODALS_PERMANENT_TOKEN_ADD,
  MODALS_PERMANENT_TOKEN_EDIT,
} from '../../constants/modals.js'

import CardSetting from '../cards/card-setting.js'
import Line from '../line.js'
import LinkItem from '../link-item.js'
import Message from '../message.js'

const LoadingMessage = (props) => {
  return h(Message, { status: 'warning' }, `Loading ${props.label}...`)
}

const RouteSettings = (props) => {
  const deleteToken = useDeleteToken()

  const domains = useDomains()
  const events = useEvents()
  const permanentTokens = usePermanentTokens()

  const onSignOut = async () => {
    await deleteToken.mutate({
      variables: {
        id: props.token,
      },
    })
    props.reset()
  }

  const createItems = (items, editFn, createFn, createLabel) => [
    ...items.flatMap((item) => [
      h(
        LinkItem,
        {
          type: 'button',
          text: item.id,
          onClick: () => editFn(item),
        },
        item.title,
      ),
      h(Line),
    ]),
    h(LinkItem, { type: 'button', onClick: createFn }, createLabel),
  ]

  const showDomainAddModal = () => props.addModal(MODALS_DOMAIN_ADD)
  const showDomainEditModal = (domain) => props.addModal(MODALS_DOMAIN_EDIT, domain)
  const showEventAddModal = () => props.addModal(MODALS_EVENT_ADD)
  const showEventEditModal = (event) => props.addModal(MODALS_EVENT_EDIT, event)
  const showPermanentTokenAddModal = () => props.addModal(MODALS_PERMANENT_TOKEN_ADD)
  const showPermanentTokenEditModal = (permanentToken) => props.addModal(MODALS_PERMANENT_TOKEN_EDIT, permanentToken)

  const domainsLoading = h(LoadingMessage, { label: 'domains' })
  const eventsLoading = h(LoadingMessage, { label: 'events' })
  const permanentTokensLoading = h(LoadingMessage, { label: 'permanent tokens' })

  const domainsItems = createItems(domains.value, showDomainEditModal, showDomainAddModal, 'New domain')
  const eventsItems = createItems(events.value, showEventEditModal, showEventAddModal, 'New event')
  const permanentTokensItems = createItems(
    permanentTokens.value,
    showPermanentTokenEditModal,
    showPermanentTokenAddModal,
    'New permanent token',
  )

  return h(
    Fragment,
    {},

    h(
      CardSetting,
      {
        headline: 'Account',
      },
      h(LinkItem, { type: 'button', onClick: onSignOut }, 'Sign Out'),
    ),

    h(
      CardSetting,
      {
        headline: 'Domains',
      },
      ...(domains.status.isInitializing === true ? [domainsLoading] : domainsItems),
    ),

    h(
      CardSetting,
      {
        headline: 'Events',
      },
      ...(events.status.isInitializing === true ? [eventsLoading] : eventsItems),
    ),

    h(
      CardSetting,
      {
        headline: 'Permanent Tokens',
      },
      ...(permanentTokens.status.isInitializing === true ? [permanentTokensLoading] : permanentTokensItems),
    ),
  )
}

RouteSettings.propTypes = {
  reset: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  addModal: PropTypes.func.isRequired,
}

export default RouteSettings
