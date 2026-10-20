window.TRACK = window.TRACK || { modules: [], exam: [] };
TRACK.meta = {
  "code": "ZCIESecurity",
  "brand": "ZyeemZia™",
  "name": "Certified Internetwork Expert — Security",
  "full": "ZyeemZia™ Certified Internetwork Expert — Security",
  "short": "ZCIE Security",
  "domain": "zcie-security.zyeemzia.com",
  "pdf": "ZCIE-Security-Book.pdf",
  "storeKey": "zcie-security.v1",
  "tagline": "Defend every layer. Trust nothing by default.",
  "lead": "An expert-level network security certification: security architecture, next-generation firewalls, VPN and PKI, identity and network access control, threat detection, SASE and cloud security, SIEM/SOAR and incident response, all wrapped in zero trust.",
  "signature": {
    "type": "stack",
    "name": "The ZCIE Security Defence-in-Depth Stack",
    "centerSub": "Defence in Depth",
    "caption": "Seven defensive layers from architecture to response, wrapped by zero trust. An attacker has to beat every layer; a defender only needs one layer to catch them."
  },
  "hours": "150–200",
  "level": "Expert",
  "audience": [
    "Senior network and security engineers",
    "SOC leads and security architects",
    "Firewall/VPN/NAC specialists",
    "ZCNP-level professionals moving into security"
  ],
  "passMark": 85,
  "distinctionMark": 92,
  "examSize": 45,
  "examMinutes": 90,
  "capstone": {
    "title": "Capstone: Zero-trust security architecture for a regulated organisation",
    "brief": "Design, build in a lab and document a defence-in-depth architecture for a fictional bank or hospital: segmented network, NGFW edge, VPN and ZTNA access, 802.1X/NAC, detection stack, SASE for branches and a SIEM/SOAR incident workflow.",
    "deliverables": [
      "Threat model and risk register (ATT&CK-mapped)",
      "Segmentation and zone design",
      "NGFW policy set with TLS-inspection decisions",
      "Site-to-site and remote-access design (VPN vs ZTNA) with a post-quantum migration plan",
      "802.1X/NAC design with posture and guest flows",
      "Detection design: IPS, email/DNS/web controls, EDR",
      "SASE/SSE design for branches and SaaS",
      "SIEM use cases and two SOAR playbooks",
      "Incident response tabletop and lessons learned",
      "Zero-trust maturity roadmap and policy-as-code example"
    ],
    "rubric": [
      {
        "criterion": "Architecture",
        "levels": [
          "Flat network",
          "Zoned design",
          "Risk-driven, zero-trust aligned"
        ]
      },
      {
        "criterion": "Perimeter",
        "levels": [
          "Any-any rules",
          "Least-privilege policy",
          "Audited, app/user-aware policy"
        ]
      },
      {
        "criterion": "VPN & access",
        "levels": [
          "Shared secrets, weak crypto",
          "Correct IPsec/TLS",
          "PKI-based, crypto-agile, ZTNA where it fits"
        ]
      },
      {
        "criterion": "Identity",
        "levels": [
          "Passwords only",
          "802.1X and MFA",
          "Posture, dynamic segmentation, phishing-resistant MFA"
        ]
      },
      {
        "criterion": "Detection",
        "levels": [
          "Default signatures",
          "Tuned detections",
          "Layered, ATT&CK-mapped coverage"
        ]
      },
      {
        "criterion": "Cloud",
        "levels": [
          "Not addressed",
          "Basic controls",
          "SASE/SSE integrated with policy"
        ]
      },
      {
        "criterion": "Response",
        "levels": [
          "No process",
          "IR plan",
          "Automated playbooks with metrics"
        ]
      },
      {
        "criterion": "Automation",
        "levels": [
          "Manual",
          "Scripts",
          "Policy-as-code with tests"
        ]
      }
    ]
  },
  "certificate": {
    "title": "Certificate of Achievement",
    "statement": "has successfully completed all modules of the ZyeemZia™ Certified Internetwork Expert — Security track and passed the ZCIE Security certification exam",
    "skills": [
      "Security architecture",
      "Firewalls, VPN & PKI",
      "Identity & NAC",
      "Threat detection & SASE",
      "Zero trust & incident response"
    ]
  },
  "disclaimer": "ZCIE Security is an independent certification programme created and issued by ZyeemZia. It is not affiliated with, endorsed by, sponsored by or equivalent to any certification from Cisco Systems, Inc. (including CCNA®, CCNP®, CCIE® and CCDE®) or from any other vendor or certifying body. All product names and trademarks belong to their respective owners. Configuration examples use widely taught, vendor-neutral style syntax.",
  "studyPlan": [
    [
      "Month 1",
      "m1 Architect",
      "Threat model, segmentation design"
    ],
    [
      "Month 2",
      "m2 Perimeter",
      "NGFW policy and TLS-inspection labs"
    ],
    [
      "Month 3",
      "m3 Tunnel",
      "IPsec/IKEv2 and PKI labs"
    ],
    [
      "Month 4",
      "m4 Identity",
      "802.1X, NAC and MFA labs"
    ],
    [
      "Month 5",
      "m5 Detect",
      "IPS tuning, email/DNS security"
    ],
    [
      "Month 6",
      "m6 Cloud",
      "SASE/SSE and cloud controls"
    ],
    [
      "Month 7",
      "m7 Respond",
      "SIEM rules, SOAR playbooks, tabletop"
    ],
    [
      "Month 8",
      "m8 ZeroTrust",
      "Mock lab, capstone, certification exam"
    ]
  ]
};
