import { AppArchitecture } from '../types/architecture';

export const INITIAL_ARCHITECTURE: AppArchitecture = {
  screens: [
    {
      id: "scr_splash",
      name: "Splash / Gatekeeper",
      group: "Auth",
      description: "Initial startup route. Evaluates cached session tokens, device biometric availability, and remote force-update flags."
    },
    {
      id: "scr_login",
      name: "Login & Auth Wall",
      group: "Auth",
      description: "Credential input with Passkey, Magic Link, or social SSO sign-in options, plus forgot password recovery link."
    },
    {
      id: "scr_onboarding",
      name: "Interactive Onboarding",
      group: "Onboarding",
      description: "Multi-step personalization flow collecting user role, workspace industry, and system push notification permissions."
    },
    {
      id: "scr_home_feed",
      name: "Personalized Home Feed",
      group: "Core",
      description: "Dynamic feed displaying recent updates, team activity stream, pinned widgets, and global search trigger."
    },
    {
      id: "scr_detail",
      name: "Item / Content Detail",
      group: "Core",
      description: "Full contextual view of selected resource featuring comment history, interactive telemetry, and export options."
    },
    {
      id: "scr_paywall",
      name: "Premium Paywall",
      group: "Monetization",
      description: "Tier comparison sheet highlighting Pro/Enterprise features, billing interval toggle (monthly/annual), and checkout CTA."
    },
    {
      id: "scr_checkout_success",
      name: "Subscription Confirmed",
      group: "Monetization",
      description: "Payment confirmation banner, instant entitlement unlock confirmation, and receipt download trigger."
    },
    {
      id: "scr_settings",
      name: "User Settings & Profile",
      group: "Settings",
      description: "Account credentials, subscription tier management, notification preferences, dark mode toggle, and sign out."
    }
  ],
  transitions: [
    {
      id: "tr_1",
      from: "scr_splash",
      to: "scr_login",
      label: "No Session Found"
    },
    {
      id: "tr_2",
      from: "scr_splash",
      to: "scr_home_feed",
      label: "Valid Session Found"
    },
    {
      id: "tr_3",
      from: "scr_login",
      to: "scr_onboarding",
      label: "New Registration"
    },
    {
      id: "tr_4",
      from: "scr_login",
      to: "scr_home_feed",
      label: "Auth Success"
    },
    {
      id: "tr_5",
      from: "scr_onboarding",
      to: "scr_home_feed",
      label: "Finish Setup"
    },
    {
      id: "tr_6",
      from: "scr_home_feed",
      to: "scr_detail",
      label: "Tap Feed Item"
    },
    {
      id: "tr_7",
      from: "scr_detail",
      to: "scr_home_feed",
      label: "Back / Dismiss"
    },
    {
      id: "tr_8",
      from: "scr_detail",
      to: "scr_paywall",
      label: "Tap Locked Feature"
    },
    {
      id: "tr_9",
      from: "scr_home_feed",
      to: "scr_settings",
      label: "Tap Profile Avatar"
    },
    {
      id: "tr_10",
      from: "scr_settings",
      to: "scr_paywall",
      label: "Upgrade Plan"
    },
    {
      id: "tr_11",
      from: "scr_paywall",
      to: "scr_checkout_success",
      label: "Confirm Purchase"
    },
    {
      id: "tr_12",
      from: "scr_checkout_success",
      to: "scr_home_feed",
      label: "Return to Feed"
    },
    {
      id: "tr_13",
      from: "scr_settings",
      to: "scr_login",
      label: "Sign Out"
    }
  ],
  journeys: [
    {
      id: "jrn_onboarding",
      name: "First-Time Onboarding",
      description: "Unauthenticated newcomer arrives, creates account, configures preferences, and enters home feed.",
      pathScreenIds: [
        "scr_splash",
        "scr_login",
        "scr_onboarding",
        "scr_home_feed"
      ],
      pathTransitionIds: [
        "tr_1",
        "tr_3",
        "tr_5"
      ]
    },
    {
      id: "jrn_returning_user",
      name: "Returning User Feed Flow",
      description: "Existing user with valid session skips authentication directly into active feed discovery.",
      pathScreenIds: [
        "scr_splash",
        "scr_home_feed",
        "scr_detail"
      ],
      pathTransitionIds: [
        "tr_2",
        "tr_6"
      ]
    },
    {
      id: "jrn_upgrade_funnel",
      name: "Subscription Upgrade Funnel",
      description: "User explores gated item in details, hits paywall, completes in-app purchase, and returns with unlocked tier.",
      pathScreenIds: [
        "scr_home_feed",
        "scr_detail",
        "scr_paywall",
        "scr_checkout_success",
        "scr_home_feed"
      ],
      pathTransitionIds: [
        "tr_6",
        "tr_8",
        "tr_11",
        "tr_12"
      ]
    },
    {
      id: "jrn_settings_upgrade",
      name: "Settings Plan Upgrade",
      description: "User reviews current account tier in profile settings and triggers the subscription flow.",
      pathScreenIds: [
        "scr_home_feed",
        "scr_settings",
        "scr_paywall",
        "scr_checkout_success"
      ],
      pathTransitionIds: [
        "tr_9",
        "tr_10",
        "tr_11"
      ]
    }
  ]
};
