window.TRACK = window.TRACK || { modules: [], exam: [] };
TRACK.modules.push({
 "id": "m1",
 "order": 1,
 "code": "Architect",
 "title": "Security Architecture & Threat Landscape",
 "subtitle": "Start from the threat: model attackers, prioritise by risk and design depth before buying products",
 "outcomes": [
  "Profile likely threat actors and describe intrusions using MITRE ATT&CK tactics",
  "Use NIST CSF 2.0 functions and profiles to express security posture and gaps",
  "Prioritise security work with likelihood × impact and annualised loss estimates",
  "Design layered defences and a phased segmentation strategy",
  "Apply secure reference patterns and zero-trust principles to campus, branch, data centre and cloud"
 ],
 "lessons": [
  {
   "id": "m1-l1",
   "title": "Threat Actors and the Attack Lifecycle",
   "subtitle": "Who attacks networks in 2026, what they want, and how an intrusion unfolds from first probe to impact",
   "minutes": 25,
   "objectives": [
    "Profile the main threat-actor groups by motive, capability and typical targets",
    "Describe an intrusion using the MITRE ATT&CK enterprise tactics at a high level",
    "Map each stage of an attack to the defensive layer best placed to stop or see it",
    "Explain why defenders must assume some controls will fail"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Security architecture starts with an honest question: **who is likely to attack us, and how?** A design that is perfect against an imaginary opponent and blind to the real one is a liability. Expert engineers begin with the threat, then choose controls — never the other way round."
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "A **threat** is an actor or event that could cause harm. A **vulnerability** is a weakness the threat could use. **Risk** is the combination of how likely that harm is and how bad it would be. Controls reduce likelihood, impact, or both — they never reduce risk to zero.",
     "title": "Threat, vulnerability, risk"
    },
    {
     "type": "table",
     "title": "Threat-actor profiles defenders plan for",
     "head": [
      "Actor",
      "Main motive",
      "Typical capability",
      "What they usually go after"
     ],
     "rows": [
      [
       "Financially motivated crime groups",
       "Money: extortion, fraud, data resale",
       "High; industrialised, uses affiliates and purchased access",
       "Any organisation that can pay; ransomware and data-theft extortion"
      ],
      [
       "State-aligned groups",
       "Espionage, pre-positioning, disruption",
       "Very high; patient, custom tooling, long dwell times",
       "Government, telecoms, energy, defence supply chain, research"
      ],
      [
       "Hacktivists",
       "Publicity and ideology",
       "Low to medium; DDoS, defacement, leaks",
       "High-profile brands and public bodies during political events"
      ],
      [
       "Insiders (malicious or careless)",
       "Grievance, gain, or simple mistakes",
       "Legitimate access already granted",
       "Data they can reach; misconfigured shares and cloud storage"
      ],
      [
       "Opportunistic scanners and botnets",
       "Volume: find anything exposed",
       "Automated, fast, low skill per target",
       "Unpatched edge devices, exposed management ports, default credentials"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Recent years have shown a steady pattern: attackers increasingly gain initial access through **internet-facing appliances** — VPN concentrators, firewalls, file-transfer servers and remote-management portals — rather than only through phishing. Your perimeter devices are both controls and targets, so they need the same patching urgency and monitoring as servers. The other fast-growing entry route is **identity**: stolen session tokens, MFA-fatigue prompts, help-desk social engineering and convincing AI-generated lures (text, voice and video). Treat sign-in systems and support desks as part of the attack surface.",
     "title": "The edge is the new front door"
    },
    {
     "type": "text",
     "text": "To discuss intrusions consistently, the industry uses **MITRE ATT&CK**, a public knowledge base of adversary behaviour observed in real incidents. Its enterprise matrix groups techniques under **tactics** — the attacker's goal at each point. You do not need to memorise hundreds of techniques; you do need to recognise the tactics and know which of your layers can see them."
    },
    {
     "type": "flow",
     "title": "A typical intrusion, expressed as ATT&CK tactics",
     "items": [
      {
       "label": "Reconnaissance",
       "text": "Scan exposed services, harvest staff names, find the VPN portal"
      },
      {
       "label": "Initial Access",
       "text": "Exploit an edge device, use stolen credentials or deliver a phishing lure"
      },
      {
       "label": "Execution & Persistence",
       "text": "Run tooling and plant a way back in that survives reboots"
      },
      {
       "label": "Privilege Escalation & Credential Access",
       "text": "Harvest passwords and tokens, become an administrator"
      },
      {
       "label": "Discovery & Lateral Movement",
       "text": "Map the network and move toward valuable systems"
      },
      {
       "label": "Collection & Exfiltration",
       "text": "Stage data and move it out, often over encrypted channels"
      },
      {
       "label": "Impact",
       "text": "Encrypt, destroy or manipulate systems and data"
      }
     ]
    },
    {
     "type": "topology",
     "title": "One intrusion drawn as an attack path",
     "caption": "Follow the numbered red links: each hop is a different ATT&CK tactic and a different chance to stop or see the attacker. Notice that the edge device is both a control and the first victim, so its logs must reach the SOC.",
     "nodes": [
      {
       "id": "atk",
       "kind": "attacker",
       "label": "Attacker",
       "sub": "crime-group affiliate",
       "x": 1,
       "y": 0
      },
      {
       "id": "drop",
       "kind": "cloud",
       "label": "File-share cloud",
       "sub": "attacker-controlled",
       "x": 5,
       "y": 0
      },
      {
       "id": "edge",
       "kind": "gateway",
       "label": "VPN appliance",
       "sub": "internet-facing, unpatched",
       "x": 1,
       "y": 2
      },
      {
       "id": "dc",
       "kind": "idp",
       "label": "Directory",
       "sub": "domain controllers",
       "x": 3,
       "y": 3
      },
      {
       "id": "fs",
       "kind": "server",
       "label": "File servers",
       "sub": "10.20.1.0/24",
       "x": 5,
       "y": 4
      },
      {
       "id": "bkp",
       "kind": "storage",
       "label": "Backup store",
       "sub": "10.20.9.0/24",
       "x": 3,
       "y": 5
      },
      {
       "id": "siem",
       "kind": "siem",
       "label": "SIEM / SOC",
       "sub": "sees logs only if sent",
       "x": 1,
       "y": 5
      }
     ],
     "links": [
      {
       "a": "atk",
       "b": "edge",
       "label": "1 exploit",
       "style": "attack"
      },
      {
       "a": "edge",
       "b": "dc",
       "label": "2 stolen creds",
       "style": "attack"
      },
      {
       "a": "dc",
       "b": "fs",
       "label": "3 lateral move",
       "style": "attack"
      },
      {
       "a": "fs",
       "b": "drop",
       "label": "4 exfil (HTTPS)",
       "style": "attack"
      },
      {
       "a": "fs",
       "b": "bkp",
       "label": "5 wipe backups",
       "style": "attack"
      },
      {
       "a": "edge",
       "b": "siem",
       "label": "logs",
       "style": "dashed"
      }
     ],
     "zones": [
      {
       "label": "Corporate network",
       "x": 0,
       "y": 2,
       "w": 6,
       "h": 4,
       "tone": "neutral"
      }
     ]
    },
    {
     "type": "keypoints",
     "items": [
      "Reconnaissance, Resource Development",
      "Initial Access, Execution, Persistence",
      "Privilege Escalation, Defense Evasion, Credential Access",
      "Discovery, Lateral Movement, Collection",
      "Command and Control, Exfiltration, Impact"
     ],
     "title": "The full set of enterprise tactics (for reference)"
    },
    {
     "type": "table",
     "title": "Where each defensive layer earns its keep",
     "head": [
      "Attack stage",
      "Best-placed layer",
      "Example control"
     ],
     "rows": [
      [
       "Reconnaissance / Initial Access",
       "Perimeter, Tunnel",
       "Minimal exposed services, patched edge devices, MFA on VPN"
      ],
      [
       "Credential Access",
       "Identity",
       "Phishing-resistant MFA, no shared admin accounts, tiered admin"
      ],
      [
       "Lateral Movement",
       "Architect (segmentation), Identity",
       "Zone-to-zone firewalling, identity-based policy, east-west inspection"
      ],
      [
       "Command and Control",
       "Perimeter, Detect",
       "Egress filtering, DNS security, TLS inspection where justified"
      ],
      [
       "Exfiltration",
       "Perimeter, Cloud, Detect",
       "Egress controls, data-loss rules, flow anomaly detection"
      ],
      [
       "Impact",
       "Respond",
       "Immutable backups, tested recovery, isolation playbooks"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Every control in this course will fail at some point — a zero-day on the firewall, a user who approves a fraudulent prompt, a misconfigured rule. Design so that a single failure gives the attacker **a foothold, not the kingdom**: limited reach, high chance of detection, fast recovery.",
     "title": "Assume breach"
    },
    {
     "type": "scenario",
     "title": "Choosing what to fix first",
     "situation": "A manufacturer's threat review finds: (1) the remote-access VPN portal runs a version with a publicly known critical flaw being actively exploited; (2) the guest Wi-Fi shares a VLAN with printers; (3) firewall logs are kept for only 7 days. You can fund one action this week.",
     "options": [
      {
       "text": "Separate guest Wi-Fi from the printer VLAN",
       "feedback": "Worth doing, but the exposure is limited to people on site. It is lower likelihood than an internet-wide exploitation campaign.",
       "best": false
      },
      {
       "text": "Extend log retention to 90 days",
       "feedback": "Retention matters for investigations, yet it does not reduce the chance of compromise this week. Do it soon, not first.",
       "best": false
      },
      {
       "text": "Patch or mitigate the VPN portal flaw immediately and check it for signs of compromise",
       "feedback": "Correct. An actively exploited flaw on an internet-facing device is the highest-likelihood, highest-impact path to initial access. Also hunt for indicators, because patching does not remove an attacker already inside.",
       "best": true
      }
     ]
    },
    {
     "type": "case",
     "title": "Bank branch breach review",
     "context": "A regional bank discovers that an attacker spent five weeks inside its branch network. Initial access came through a branch router's exposed web management interface with a default password. From there the attacker reached the flat branch LAN, captured credentials from a teller workstation, used them to log in to a core-banking jump server at headquarters, and attempted to stage customer data for exfiltration over HTTPS. The SOC detected the activity only when an analyst noticed unusual outbound volume.",
     "questions": [
      "Map the intrusion to ATT&CK tactics.",
      "Which three architectural weaknesses made the attack easy?",
      "Which single control would have most likely stopped it at the start?",
      "What detection opportunities were missed before the exfiltration attempt?"
     ],
     "answer": "**Tactics:** Initial Access (exposed management interface, default credential), Credential Access (teller workstation), Lateral Movement (branch to headquarters jump server), Collection and Exfiltration (staging, HTTPS upload). **Weaknesses:** management plane reachable from the internet; flat branch LAN with no segmentation between users and infrastructure; jump server accepting passwords without MFA from any branch address. **First-stop control:** removing internet exposure of management interfaces (management only from a dedicated out-of-band or management VRF) plus credential hygiene. **Missed detections:** admin login to the router from an unfamiliar public IP, new device logins on the jump server from a teller subnet, and east-west authentication anomalies. The lesson: the bank had perimeter controls but no **depth** behind them."
    },
    {
     "type": "reflection",
     "prompt": "Pick one real network you know. Which threat-actor group is most likely to target it, and which ATT&CK tactic do you currently have the weakest visibility into?"
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "Start every design from realistic threat actors and their usual methods, not from product lists.",
      "Internet-facing appliances and identity systems are today's most common front doors; patch and monitor them like crown-jewel servers.",
      "ATT&CK tactics give a shared language to map each attack stage to the layer best placed to stop or see it.",
      "Assume breach: design so one failed control gives a foothold, not the kingdom."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Which statement best describes an ATT&CK tactic?",
       "options": [
        "A specific exploit for a named software vulnerability, such as a VPN portal flaw",
        "The adversary's goal at a stage of the intrusion, such as Lateral Movement",
        "A vendor detection signature that identifies one known malware family on endpoints",
        "A compliance control from a national security framework"
       ],
       "answer": 1,
       "explain": "Tactics are the 'why' (the goal at that stage); techniques are the 'how'. Exploits, signatures and compliance controls are different concepts."
      },
      {
       "q": "An attacker uses stolen credentials to log in to a jump server from a branch PC. Which tactic is this primarily?",
       "options": [
        "Reconnaissance",
        "Resource Development",
        "Exfiltration",
        "Lateral Movement"
       ],
       "answer": 3,
       "explain": "Moving from one compromised system to another inside the environment is Lateral Movement. Reconnaissance and Resource Development happen before access; Exfiltration is moving data out."
      },
      {
       "q": "Why have internet-facing VPN and firewall appliances become a priority for defenders?",
       "options": [
        "They are frequently exploited for access and are monitored less than servers",
        "They are rarely reachable from the internet, so attackers hide on them for long periods",
        "They cannot be patched in place, so they must be fully replaced every year",
        "They matter only for state-aligned actors, not for financially motivated groups"
       ],
       "answer": 0,
       "explain": "Edge devices are exposed by design, widely targeted, and often less monitored than servers. They can be patched and are targeted by all actor types."
      },
      {
       "q": "What does 'assume breach' mean for architecture?",
       "options": [
        "Treat every alert as a confirmed incident and isolate the whole network immediately",
        "Stop investing in prevention controls because detection and response are always more cost-effective",
        "Design so one failed control limits the attacker's reach and is likely to be detected",
        "Allow only encrypted traffic so attackers cannot read any data in transit inside"
       ],
       "answer": 2,
       "explain": "Assume breach keeps prevention but adds containment and detection depth. It does not mean abandoning prevention or overreacting to every alert."
      },
      {
       "q": "Which pairing of attack stage and best-placed control is correct?",
       "options": [
        "Impact — longer password expiry periods for all staff accounts",
        "Reconnaissance — immutable, offline backups stored at a second data centre",
        "Credential Access — phishing-resistant MFA and tiered admin accounts",
        "Exfiltration — disabling 802.1X on access ports to reduce noise"
       ],
       "answer": 2,
       "explain": "Phishing-resistant MFA and admin tiering directly reduce credential theft and reuse. The other pairings do not address the stage named."
      }
     ]
    }
   ]
  },
  {
   "id": "m1-l2",
   "title": "NIST CSF 2.0 and Risk-Based Prioritisation",
   "subtitle": "Use a common language for security outcomes and spend effort where risk is highest",
   "minutes": 25,
   "objectives": [
    "Explain the six NIST CSF 2.0 functions and how Govern ties them together",
    "Build current and target profiles to show security gaps",
    "Score and rank risks with likelihood, impact and simple loss estimates",
    "Turn a risk register into a defensible, sequenced engineering roadmap"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Engineers often jump to products. Leaders ask different questions: *What are we protecting? How well? What should we fix next, and why?* The **NIST Cybersecurity Framework (CSF) 2.0**, published in 2024, gives both groups a shared vocabulary. It is outcome-based: it says what good looks like, not which box to buy."
    },
    {
     "type": "framework",
     "title": "The six CSF 2.0 functions",
     "items": [
      {
       "label": "GV",
       "title": "Govern",
       "text": "Set the strategy, roles, policy, risk appetite and supply-chain expectations. Govern sits at the centre and informs every other function."
      },
      {
       "label": "ID",
       "title": "Identify",
       "text": "Know your assets, data, suppliers and risks, and keep improving based on lessons learned."
      },
      {
       "label": "PR",
       "title": "Protect",
       "text": "Safeguards: identity and access control, awareness, data security, platform security and resilient infrastructure."
      },
      {
       "label": "DE",
       "title": "Detect",
       "text": "Continuous monitoring and analysis of adverse events so that attacks are found quickly."
      },
      {
       "label": "RS",
       "title": "Respond",
       "text": "Manage, analyse, contain and communicate about incidents once detected."
      },
      {
       "label": "RC",
       "title": "Recover",
       "text": "Restore assets and operations and communicate during recovery."
      }
     ]
    },
    {
     "type": "cycle",
     "title": "CSF 2.0: Govern at the centre of five functions",
     "center": "Govern",
     "items": [
      {
       "label": "Identify",
       "text": "Assets, suppliers, risks and improvement lessons"
      },
      {
       "label": "Protect",
       "text": "Identity, data, platform and infrastructure safeguards"
      },
      {
       "label": "Detect",
       "text": "Continuous monitoring and analysis of adverse events"
      },
      {
       "label": "Respond",
       "text": "Manage, analyse, contain and report incidents"
      },
      {
       "label": "Recover",
       "text": "Restore operations and communicate"
      }
     ],
     "caption": "Govern is drawn in the middle because strategy, ownership and risk appetite steer every other function; the outer five run as a continuous loop, not a one-off project."
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "CSF 2.0 added **Govern** as a sixth function. For a network team this is where risk appetite, ownership of firewall policy, change approval and supplier requirements live. A brilliant segmentation design without an owner and a review cycle decays within a year.",
     "title": "Why Govern matters to network engineers"
    },
    {
     "type": "table",
     "title": "Where network-security work lands in CSF 2.0",
     "head": [
      "Function",
      "Example category",
      "Network-security evidence"
     ],
     "rows": [
      [
       "Govern",
       "Roles, responsibilities and authorities",
       "Named owner for each firewall policy set and each VPN"
      ],
      [
       "Identify",
       "Asset management",
       "Inventory of edge devices, firmware versions and exposed services"
      ],
      [
       "Protect",
       "Identity management, authentication and access control",
       "802.1X on access ports, MFA on remote access, TACACS+ for admins"
      ],
      [
       "Protect",
       "Technology infrastructure resilience",
       "Firewall HA, diverse VPN paths, segmented management plane"
      ],
      [
       "Detect",
       "Continuous monitoring",
       "Firewall, NAC and VPN logs streamed to the SIEM with alerting"
      ],
      [
       "Respond",
       "Incident mitigation",
       "Pre-approved quarantine VLAN and change-of-authorisation playbooks"
      ],
      [
       "Recover",
       "Incident recovery plan execution",
       "Golden configs and tested rebuild of edge devices"
      ]
     ]
    },
    {
     "type": "text",
     "text": "CSF 2.0 uses **Organizational Profiles** to describe posture. A **current profile** records the outcomes you achieve today; a **target profile** records the outcomes you need, given your risks and obligations. The gap between them is your work plan. CSF also offers **tiers** (Partial, Risk Informed, Repeatable, Adaptive) to describe how rigorous your risk governance and management practices are. NIST publishes free Quick-Start Guides and mappings (informative references) to other standards alongside the core."
    },
    {
     "type": "formula",
     "title": "Risk arithmetic you will actually use",
     "items": [
      {
       "name": "Qualitative risk",
       "expr": "Risk = Likelihood × Impact",
       "meaning": "Score each on 1–5; a 4 × 5 = 20 outranks a 3 × 3 = 9. Simple, fast and good for ranking."
      },
      {
       "name": "Single loss expectancy",
       "expr": "SLE = Asset value × Exposure factor",
       "meaning": "Expected loss from one event; e.g. a 2,000,000 asset with 30% exposure gives SLE 600,000."
      },
      {
       "name": "Annualised loss expectancy",
       "expr": "ALE = SLE × ARO",
       "meaning": "ARO is how many times per year you expect the event; 600,000 × 0.2 = 120,000 per year."
      },
      {
       "name": "Control value",
       "expr": "Value = ALE before − ALE after − Annual control cost",
       "meaning": "A positive value supports the investment case; negative means the control costs more than it saves."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Likelihood and impact scores are judgements. Write down the reasoning (threat intelligence, exposure, past incidents) next to each score so that reviewers can challenge it. A precise number with no reasoning is worse than an honest range.",
     "title": "Numbers are inputs, not truth"
    },
    {
     "type": "matrix",
     "title": "Likelihood × impact: what to do with each quadrant",
     "x": "Likelihood (low → high)",
     "y": "Impact (low → high)",
     "quadrants": [
      {
       "title": "Plan, contain and insure",
       "items": [
        "Data-centre flood",
        "Supplier compromise",
        "Tested recovery and insurance"
       ]
      },
      {
       "title": "Treat now",
       "items": [
        "Exploited flaw on the VPN portal",
        "Flat server network + ransomware",
        "Emergency change, owner, date"
       ]
      },
      {
       "title": "Accept and review",
       "items": [
        "Defacement of a static brochure site",
        "Document acceptance within appetite"
       ]
      },
      {
       "title": "Automate and reduce",
       "items": [
        "Commodity phishing reaching inboxes",
        "Mass scanning of the edge",
        "Filtering, hardening, playbooks"
       ]
      }
     ],
     "caption": "Scores rank risks, but the quadrant tells you the kind of treatment: top-right items go on this month's roadmap, while high-impact, low-likelihood risks need containment and recovery plans rather than daily effort."
    },
    {
     "type": "steps",
     "title": "From risk register to roadmap",
     "items": [
      {
       "title": "List scenarios",
       "text": "Write risks as scenarios: 'Crime group exploits unpatched VPN portal and deploys ransomware'."
      },
      {
       "title": "Score inherent risk",
       "text": "Rate likelihood and impact with today's controls, using the same scale for everyone."
      },
      {
       "title": "Choose a treatment",
       "text": "Mitigate, transfer (for example insurance), avoid (stop the activity) or accept within appetite."
      },
      {
       "title": "Sequence by risk reduction per effort",
       "text": "Quick, high-reduction actions first; large programmes split into phases."
      },
      {
       "title": "Assign owners and dates",
       "text": "Every action has a person, a date and a measurable outcome."
      },
      {
       "title": "Re-score and review",
       "text": "Update residual risk after each change and review the register at least quarterly."
      }
     ]
    },
    {
     "type": "template",
     "title": "Threat-model and risk register sheet",
     "purpose": "Capture each risk scenario with the reasoning behind its score and the planned treatment.",
     "columns": [
      "Asset / service",
      "Threat scenario",
      "Likelihood (1–5)",
      "Impact (1–5)",
      "Score",
      "Treatment and control",
      "Owner / due"
     ],
     "example": [
      [
       "Remote-access VPN",
       "Crime group exploits unpatched portal, deploys ransomware",
       "4",
       "5",
       "20",
       "Mitigate: patch SLA 72h, MFA, portal hardening, alerting on new admin sessions",
       "Network lead / 30 days"
      ],
      [
       "Branch LAN",
       "Insider plugs rogue device into open port",
       "3",
       "3",
       "9",
       "Mitigate: 802.1X with MAB fallback, unused ports shut",
       "NAC engineer / Q3"
      ]
     ],
     "rows": 6
    },
    {
     "type": "scenario",
     "title": "Defending the budget",
     "situation": "The CFO asks why the security team wants to spend 80,000 per year on a managed detection service. Your estimate: a ransomware event has SLE 1,500,000 and ARO 0.15 today; with the service you expect ARO 0.05. What is the strongest argument?",
     "options": [
      {
       "text": "ALE falls from 225,000 to 75,000, a reduction of 150,000 for an 80,000 annual cost",
       "feedback": "Correct. 1,500,000 × 0.15 = 225,000; × 0.05 = 75,000. The 150,000 reduction exceeds the 80,000 cost, giving a net value of 70,000 per year, and you can show the assumptions.",
       "best": true
      },
      {
       "text": "Peer organisations already use similar services, so we should too",
       "feedback": "Peer practice is supporting context, but it does not show value for this organisation.",
       "best": false
      },
      {
       "text": "Any ransomware event would be catastrophic, so cost does not matter",
       "feedback": "This avoids the question and weakens credibility. Leaders expect a reasoned trade-off.",
       "best": false
      },
      {
       "text": "The framework requires a managed detection service",
       "feedback": "CSF is outcome-based and does not require any specific service or product.",
       "best": false
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Write one risk scenario for your organisation in the format 'actor + method + asset + consequence'. What evidence would you use to justify its likelihood score?"
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "CSF 2.0 has six functions; Govern sets strategy, ownership and risk appetite for the other five.",
      "Current and target profiles turn posture into a gap list that becomes the roadmap.",
      "Likelihood × impact ranks risks quickly; SLE, ARO and ALE put money on them when leaders need a business case.",
      "Write down the reasoning behind every score so it can be challenged and re-scored after each change."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "What is the role of the Govern function in CSF 2.0?",
       "options": [
        "It sets strategy, roles, policy and risk appetite that guide all other functions",
        "It replaces the Identify function that earlier framework versions used for asset inventory",
        "It covers only supplier contracts and procurement checks",
        "It defines technical controls such as firewall rule syntax"
       ],
       "answer": 0,
       "explain": "Govern was added in 2.0 and sits across the other functions. It does not replace Identify and is not limited to suppliers or technical syntax."
      },
      {
       "q": "A risk has likelihood 4 and impact 3; another has likelihood 2 and impact 5. Using Likelihood × Impact, which is higher?",
       "options": [
        "The second, because impact always outweighs likelihood",
        "They are equal, because both total seven points",
        "Neither can be ranked without monetary values",
        "The first, scoring 12 against 10"
       ],
       "answer": 3,
       "explain": "4 × 3 = 12 and 2 × 5 = 10. The method multiplies rather than adds, and qualitative scores rank risks without money values."
      },
      {
       "q": "An asset worth 400,000 has an exposure factor of 25% and an ARO of 2. What is the ALE?",
       "options": [
        "100,000",
        "200,000",
        "50,000",
        "800,000"
       ],
       "answer": 1,
       "explain": "SLE = 400,000 × 0.25 = 100,000. ALE = 100,000 × 2 = 200,000."
      },
      {
       "q": "What does the gap between a current and a target CSF profile represent?",
       "options": [
        "The outcomes still to be achieved, which become the improvement plan",
        "The maturity tier that the organisation has been formally certified at by NIST",
        "The list of vendors that must be replaced to comply",
        "The number of incidents expected over the next year"
       ],
       "answer": 0,
       "explain": "Profiles describe outcomes; the difference is the work to do. Tiers describe rigour, and CSF neither certifies nor mandates vendors."
      },
      {
       "q": "Which treatment is an example of risk transfer?",
       "options": [
        "Disabling a risky legacy file-transfer service entirely and permanently",
        "Adding MFA to the remote-access VPN for all staff and contractors",
        "Buying cyber insurance that covers part of the incident cost",
        "Documenting acceptance of a low risk"
       ],
       "answer": 2,
       "explain": "Insurance shifts part of the financial impact to another party. Disabling is avoidance, MFA is mitigation and documented acceptance is acceptance."
      }
     ]
    }
   ]
  },
  {
   "id": "m1-l3",
   "title": "Defence in Depth and Segmentation Strategy",
   "subtitle": "Layer independent controls and divide the network so that one failure stays small",
   "minutes": 28,
   "objectives": [
    "Describe the ZCIE Security Defence-in-Depth Stack and the role of each layer",
    "Design a segmentation model using zones, trust levels and enforcement points",
    "Choose between VLAN/VRF, firewall, and identity-based segmentation techniques",
    "Plan a phased segmentation rollout that avoids outages"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "**Defence in depth** means stacking controls that fail independently, so an attacker must defeat several different mechanisms in sequence. The key word is *independently*: three products that all trust the same stolen password give you one layer, not three."
    },
    {
     "type": "layers",
     "title": "The ZCIE Security Defence-in-Depth Stack",
     "items": [
      {
       "label": "ZeroTrust (wrapper)",
       "parts": [
        "Never trust by location",
        "Verify every request",
        "Least privilege",
        "Continuous evaluation"
       ]
      },
      {
       "label": "Respond",
       "parts": [
        "SIEM and SOAR",
        "Incident response",
        "Recovery"
       ]
      },
      {
       "label": "Cloud",
       "parts": [
        "SASE / SSE",
        "Cloud workload controls",
        "ZTNA"
       ]
      },
      {
       "label": "Detect",
       "parts": [
        "IDS/IPS",
        "EDR/XDR",
        "Email, web and DNS security"
       ]
      },
      {
       "label": "Identity",
       "parts": [
        "AAA",
        "802.1X / NAC",
        "MFA"
       ]
      },
      {
       "label": "Tunnel and Perimeter",
       "parts": [
        "IPsec and TLS VPN",
        "Next-generation firewalls",
        "NAT and TLS inspection"
       ]
      },
      {
       "label": "Architect",
       "parts": [
        "Threat model",
        "Segmentation",
        "Risk-based roadmap"
       ]
      }
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Architect is the foundation: without a threat model and segmentation plan, the other layers are bolted on at random. ZeroTrust is drawn as a wrapper because it is a set of principles applied to every layer, not a product you add at the top.",
     "title": "How to read the stack"
    },
    {
     "type": "text",
     "text": "Segmentation is the most powerful architectural control a network team owns. It decides **what can talk to what**, which directly limits lateral movement, the blast radius of ransomware and the scope of compliance audits."
    },
    {
     "type": "table",
     "title": "Segmentation techniques compared",
     "head": [
      "Technique",
      "What it separates",
      "Strength",
      "Limitation"
     ],
     "rows": [
      [
       "VLANs",
       "Layer-2 broadcast domains",
       "Cheap, universal",
       "No policy by itself; routing between VLANs is open unless filtered"
      ],
      [
       "VRFs",
       "Routing tables (macro-segments)",
       "Strong separation of whole environments",
       "Inter-VRF traffic needs a deliberate leak or a firewall"
      ],
      [
       "Firewall zones",
       "Traffic between trust levels",
       "Stateful, application- and user-aware policy",
       "Traffic inside a zone is not inspected"
      ],
      [
       "Identity/group-based policy",
       "Users and devices regardless of IP",
       "Follows the user; scales with roles",
       "Needs strong identity, NAC and consistent tagging"
      ],
      [
       "Host / workload micro-segmentation",
       "Individual servers or workloads",
       "Finest granularity, stops east-west inside a subnet",
       "Operational overhead; needs good application maps"
      ]
     ]
    },
    {
     "type": "framework",
     "title": "Five principles for a segmentation model",
     "items": [
      {
       "label": "S1",
       "title": "Classify by trust and function",
       "text": "Group assets by data sensitivity and role: users, servers, OT, management, guests, partners."
      },
      {
       "label": "S2",
       "title": "Default deny between segments",
       "text": "Every inter-segment flow is explicitly justified and documented."
      },
      {
       "label": "S3",
       "title": "Separate the management plane",
       "text": "Device management lives in its own segment or VRF, reachable only from hardened admin hosts."
      },
      {
       "label": "S4",
       "title": "Enforce at the right point",
       "text": "Macro-segments at firewalls and VRFs; micro-segments with identity or host policy."
      },
      {
       "label": "S5",
       "title": "Make it observable",
       "text": "Log allowed and denied inter-segment flows so you can prove the design works."
      }
     ]
    },
    {
     "type": "compare",
     "title": "Macro- versus micro-segmentation",
     "columns": [
      {
       "title": "Macro-segmentation",
       "items": [
        "Separates large environments (production, development, OT, guest)",
        "Enforced by VRFs and firewalls",
        "Quick to deploy, coarse grained",
        "Answers: which environments can talk?"
       ]
      },
      {
       "title": "Micro-segmentation",
       "items": [
        "Separates individual workloads or user groups",
        "Enforced by identity tags, host firewalls or workload agents",
        "Needs application dependency maps",
        "Answers: which specific systems can talk?"
       ]
      }
     ]
    },
    {
     "type": "topology",
     "title": "Macro-segments around an internal segmentation firewall",
     "caption": "Every zone reaches the others only through the firewall, so the vendor-exposed test server can no longer talk directly to patient records. Guest and IoT get internet only; management is reachable only from the jump hosts.",
     "nodes": [
      {
       "id": "clin",
       "kind": "server",
       "label": "Clinical servers",
       "sub": "10.20.0.0/16",
       "x": 1,
       "y": 1
      },
      {
       "id": "img",
       "kind": "server",
       "label": "Imaging",
       "sub": "10.30.0.0/16",
       "x": 3,
       "y": 1
      },
      {
       "id": "vend",
       "kind": "server",
       "label": "Vendor test web",
       "sub": "10.40.0.0/24",
       "x": 5,
       "y": 1
      },
      {
       "id": "isfw",
       "kind": "firewall",
       "label": "Internal seg. FW",
       "sub": "default deny between zones",
       "x": 3,
       "y": 3
      },
      {
       "id": "usr",
       "kind": "user",
       "label": "Staff users",
       "sub": "VRF USERS 10.10.0.0/16",
       "x": 1,
       "y": 5
      },
      {
       "id": "gst",
       "kind": "laptop",
       "label": "Guest / IoT",
       "sub": "VRF GUEST, internet only",
       "x": 3,
       "y": 5
      },
      {
       "id": "mgmt",
       "kind": "monitor",
       "label": "Jump hosts",
       "sub": "VRF MGMT 10.250.0.0/16",
       "x": 5,
       "y": 5
      }
     ],
     "links": [
      {
       "a": "clin",
       "b": "isfw"
      },
      {
       "a": "img",
       "b": "isfw"
      },
      {
       "a": "vend",
       "b": "isfw",
       "label": "vendor zone",
       "style": "bold"
      },
      {
       "a": "usr",
       "b": "isfw",
       "label": "apps only"
      },
      {
       "a": "gst",
       "b": "isfw",
       "label": "internet only",
       "style": "dashed"
      },
      {
       "a": "mgmt",
       "b": "isfw",
       "label": "SSH/HTTPS admin"
      }
     ],
     "zones": [
      {
       "label": "Clinical and imaging",
       "x": 0,
       "y": 1,
       "w": 4,
       "h": 1,
       "tone": "good"
      },
      {
       "label": "Vendor / test",
       "x": 5,
       "y": 1,
       "w": 1,
       "h": 1,
       "tone": "warn"
      },
      {
       "label": "Users",
       "x": 0,
       "y": 5,
       "w": 2,
       "h": 1,
       "tone": "neutral"
      },
      {
       "label": "Guest / IoT",
       "x": 3,
       "y": 5,
       "w": 1,
       "h": 1,
       "tone": "bad"
      },
      {
       "label": "Management",
       "x": 5,
       "y": 5,
       "w": 1,
       "h": 1,
       "tone": "accent"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Separating the management plane with a VRF",
     "device": "CORE1 · IOS-style CLI",
     "lines": [
      "! Dedicated management VRF; no route leaking to user VRFs",
      "vrf definition MGMT",
      " address-family ipv4",
      " exit-address-family",
      "interface GigabitEthernet0/0",
      " description OOB management network",
      " vrf forwarding MGMT",
      " ip address 10.250.0.11 255.255.255.0",
      "ip access-list standard ADMIN-HOSTS",
      " permit 10.250.10.0 0.0.0.255",
      "line vty 0 15",
      " access-class ADMIN-HOSTS in vrf-also",
      " transport input ssh"
     ],
     "note": "The `vrf-also` keyword lets the access class apply to SSH sessions arriving through a VRF interface."
    },
    {
     "type": "steps",
     "title": "Phased segmentation rollout",
     "items": [
      {
       "title": "Discover",
       "text": "Collect flow data (NetFlow/IPFIX or firewall logs) for several weeks to see real dependencies."
      },
      {
       "title": "Design",
       "text": "Define segments and an inter-segment flow matrix from that data, with business owners."
      },
      {
       "title": "Monitor mode",
       "text": "Deploy enforcement points in log-only or permit-and-log mode and compare against the matrix."
      },
      {
       "title": "Enforce in waves",
       "text": "Turn on deny for low-risk segments first, then critical ones, with a rollback plan."
      },
      {
       "title": "Operate",
       "text": "Review rule requests and flow logs; remove exceptions that are no longer needed."
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Flat data-centre network",
     "situation": "A hospital's data centre has 400 servers in one VLAN, including the patient-records database, imaging systems and a test web server exposed to vendors. Ransomware in a peer hospital spread server-to-server in minutes. Leadership wants a quick, meaningful reduction in blast radius.",
     "options": [
      {
       "text": "Deploy host-based micro-segmentation on all 400 servers this quarter",
       "feedback": "Valuable long term, but without dependency maps it is slow and risky; macro-segments first give faster risk reduction.",
       "best": false
      },
      {
       "text": "Create macro-segments (clinical, imaging, test/vendor, management) behind a firewall, using flow data to build the rules, and enforce in waves",
       "feedback": "Best. It quickly separates the highest-risk zone (vendor-exposed test) from clinical systems, is evidence-driven and avoids a big-bang outage.",
       "best": true
      },
      {
       "text": "Move every server to its own VLAN with no filtering between them",
       "feedback": "VLANs alone do not enforce policy; inter-VLAN routing would still allow the spread.",
       "best": false
      },
      {
       "text": "Rely on endpoint protection to stop ransomware spreading",
       "feedback": "Endpoint controls are one layer; relying on them alone is the opposite of defence in depth.",
       "best": false
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Segmentation design review",
     "items": [
      "Every segment has a named owner and a data-sensitivity classification",
      "Inter-segment traffic is default deny with documented exceptions",
      "Management interfaces are unreachable from user and guest segments",
      "Flow data was used to build the rules, not guesses",
      "Guest, IoT and OT segments cannot initiate connections to corporate servers",
      "Denied and allowed inter-segment flows are logged centrally",
      "A rollback plan exists for each enforcement wave"
     ]
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "Defence in depth needs independent failure modes, not just more products.",
      "VLANs separate broadcast domains but enforce nothing; VRFs, firewall zones, identity policy and host policy enforce.",
      "Start with macro-segments and a separate management plane, then add micro-segmentation where application maps exist.",
      "Roll out from flow data: discover, design, monitor, enforce in waves, then operate and prune exceptions."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Why do three controls that all rely on the same password count as only one layer?",
       "options": [
        "Because layers must come from three different vendors",
        "Because a single stolen credential defeats all three at once",
        "Because password controls are never part of defence in depth",
        "Because only network controls count as true layers"
       ],
       "answer": 1,
       "explain": "Depth depends on independent failure modes. Vendor diversity is not the point, and identity controls are a legitimate layer."
      },
      {
       "q": "Which technique, on its own, provides NO policy enforcement between groups?",
       "options": [
        "Putting groups in separate firewall zones with default deny",
        "Placing groups in VRFs with no route leaking between them",
        "Applying identity-based group policy at the access-layer switches",
        "Placing groups in separate VLANs with open inter-VLAN routing"
       ],
       "answer": 3,
       "explain": "VLANs separate broadcast domains; if routing between them is unfiltered, nothing is enforced. The other options all enforce separation."
      },
      {
       "q": "What is the main reason to separate the management plane?",
       "options": [
        "To improve routing convergence speed for user and server traffic in the core",
        "To stop compromised users or servers reaching device management interfaces",
        "To let management traffic bypass logging so the SIEM is not overloaded",
        "To make SNMP work without credentials"
       ],
       "answer": 1,
       "explain": "Management interfaces are high-value targets; isolating them limits who can attack them. It is not about speed, bypassing logs or weakening authentication."
      },
      {
       "q": "What should come FIRST in a segmentation rollout for an existing network?",
       "options": [
        "Enable default-deny rules between all of the new segments on day one",
        "Buy a micro-segmentation agent for every server",
        "Renumber every subnet into a new addressing plan",
        "Collect flow data to understand real application dependencies"
       ],
       "answer": 3,
       "explain": "Without dependency data, enforcement causes outages. Enforcement, tooling and renumbering come later and only if justified."
      },
      {
       "q": "Micro-segmentation is best described as:",
       "options": [
        "Policy between individual workloads or user groups, often via identity tags or host policy",
        "Splitting a network into separate production and development VRFs with a firewall between",
        "Using smaller subnet masks so each VLAN holds fewer hosts and less broadcast traffic",
        "Placing a perimeter firewall at each internet connection"
       ],
       "answer": 0,
       "explain": "Micro-segmentation controls flows between individual systems or groups. VRF splits are macro-segmentation; subnet size and perimeter firewalls are not segmentation strategies by themselves."
      }
     ]
    }
   ]
  },
  {
   "id": "m1-l4",
   "title": "Secure Architecture Patterns and Zero-Trust Principles",
   "subtitle": "Reference patterns for campus, branch, data centre and cloud, and the zero-trust ideas that connect them",
   "minutes": 28,
   "objectives": [
    "Apply reference security patterns to campus, branch, data-centre and cloud designs",
    "Explain the zero-trust tenets and logical components described in NIST SP 800-207",
    "Identify common architectural anti-patterns and their fixes",
    "Document a security architecture decision with its rationale"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Architecture patterns are reusable answers to recurring problems. They do not remove the need to think, but they stop teams reinventing (and re-breaking) the same designs. The patterns below are vendor-neutral; map each control to whatever platforms you operate."
    },
    {
     "type": "table",
     "title": "Reference patterns by place in the network",
     "head": [
      "Place",
      "Key risks",
      "Core pattern"
     ],
     "rows": [
      [
       "Campus",
       "Rogue devices, lateral movement between users, IoT",
       "802.1X/NAC at access ports, identity-based segmentation, guest isolation, internal firewall between users and servers"
      ],
      [
       "Branch",
       "Local internet breakout, small staff, physical exposure",
       "Branch firewall with application policy, IPsec or SD-WAN overlay to hubs, cloud-delivered web security, 802.1X or MAB on every port"
      ],
      [
       "Data centre",
       "East-west spread, privileged access, high-value data",
       "Macro-segments by tier and sensitivity, east-west firewalling, privileged access through hardened jump hosts, out-of-band management"
      ],
      [
       "Public cloud",
       "Misconfiguration, over-privileged identities, exposed storage",
       "Hub-and-spoke virtual networks with central inspection, security groups as micro-segments, least-privilege roles, logging on by default"
      ],
      [
       "Remote users",
       "Stolen credentials, unmanaged devices",
       "Phishing-resistant MFA, device posture checks, per-application access (ZTNA) rather than full network access"
      ]
     ]
    },
    {
     "type": "layers",
     "title": "Campus security architecture, top to bottom",
     "items": [
      {
       "label": "Internet edge",
       "parts": [
        "NGFW pair in HA",
        "TLS inspection policy",
        "DDoS protection upstream"
       ]
      },
      {
       "label": "Services and DMZ",
       "parts": [
        "Reverse proxy and WAF",
        "DMZ zone per exposure type",
        "Remote-access VPN termination"
       ]
      },
      {
       "label": "Core and distribution",
       "parts": [
        "Internal segmentation firewall",
        "VRFs for macro-segments",
        "Flow export to SIEM"
       ]
      },
      {
       "label": "Access",
       "parts": [
        "802.1X / MAB with dynamic policy",
        "Port security and DHCP snooping",
        "Guest and IoT isolation"
       ]
      },
      {
       "label": "Management",
       "parts": [
        "Out-of-band network",
        "TACACS+ device admin",
        "Hardened jump hosts"
       ]
      }
     ]
    },
    {
     "type": "topology",
     "title": "Campus edge, DMZ and internal segmentation",
     "caption": "Published services and VPN termination sit in DMZ segments behind the edge pair, never on the internal LAN. A second, internal firewall controls east-west traffic, and management lives on its own out-of-band path.",
     "nodes": [
      {
       "id": "inet",
       "kind": "internet",
       "label": "Internet",
       "x": 3,
       "y": 0
      },
      {
       "id": "ngfw",
       "kind": "firewall",
       "label": "Edge NGFW pair",
       "sub": "HA, app and TLS policy",
       "x": 3,
       "y": 1
      },
      {
       "id": "waf",
       "kind": "lb",
       "label": "Reverse proxy",
       "sub": "WAF · DMZ 172.16.10.0/24",
       "x": 1,
       "y": 2
      },
      {
       "id": "ravpn",
       "kind": "gateway",
       "label": "Remote-access GW",
       "sub": "DMZ 172.16.20.0/24",
       "x": 5,
       "y": 2
      },
      {
       "id": "isfw",
       "kind": "firewall",
       "label": "Internal seg. FW",
       "sub": "east-west policy",
       "x": 3,
       "y": 3
      },
      {
       "id": "core",
       "kind": "l3switch",
       "label": "Core / VRFs",
       "sub": "flow export to SIEM",
       "x": 3,
       "y": 4
      },
      {
       "id": "srv",
       "kind": "server",
       "label": "App servers",
       "sub": "10.20.0.0/16",
       "x": 1,
       "y": 5
      },
      {
       "id": "usr",
       "kind": "user",
       "label": "Campus users",
       "sub": "802.1X / NAC",
       "x": 3,
       "y": 6
      },
      {
       "id": "mgmt",
       "kind": "monitor",
       "label": "OOB mgmt",
       "sub": "jump hosts, TACACS+",
       "x": 5,
       "y": 5
      }
     ],
     "links": [
      {
       "a": "inet",
       "b": "ngfw"
      },
      {
       "a": "ngfw",
       "b": "waf"
      },
      {
       "a": "ngfw",
       "b": "ravpn"
      },
      {
       "a": "ngfw",
       "b": "isfw"
      },
      {
       "a": "isfw",
       "b": "core"
      },
      {
       "a": "core",
       "b": "srv"
      },
      {
       "a": "core",
       "b": "usr"
      },
      {
       "a": "core",
       "b": "mgmt",
       "label": "OOB",
       "style": "dashed"
      }
     ],
     "zones": [
      {
       "label": "DMZ",
       "x": 0,
       "y": 2,
       "w": 7,
       "h": 1,
       "tone": "warn"
      }
     ]
    },
    {
     "type": "text",
     "text": "**Zero trust** is the idea that network location alone never grants trust. NIST SP 800-207 defines it as a set of principles that move defences from static perimeters to individual users, devices and resources. Every access request is evaluated on identity, device state and context, then granted with the least privilege needed, for a limited time."
    },
    {
     "type": "framework",
     "title": "Zero-trust tenets in network terms",
     "items": [
      {
       "label": "Z1",
       "title": "All resources are protected",
       "text": "Servers, SaaS, printers and OT devices all sit behind policy, not just 'critical' systems."
      },
      {
       "label": "Z2",
       "title": "Location grants nothing",
       "text": "Being on the corporate LAN or VPN does not by itself earn access."
      },
      {
       "label": "Z3",
       "title": "Per-session access",
       "text": "Access is granted per request or session, with least privilege."
      },
      {
       "label": "Z4",
       "title": "Dynamic policy",
       "text": "Decisions use identity, device posture, behaviour and environment signals."
      },
      {
       "label": "Z5",
       "title": "Monitor asset integrity",
       "text": "The posture of every owned device is measured continuously."
      },
      {
       "label": "Z6",
       "title": "Strict authentication",
       "text": "Authentication and authorisation are enforced before access and re-evaluated."
      },
      {
       "label": "Z7",
       "title": "Collect and improve",
       "text": "Telemetry from all of this is used to improve policy over time."
      }
     ]
    },
    {
     "type": "topology",
     "title": "NIST SP 800-207 logical components",
     "caption": "The subject never reaches the resource directly: the PEP holds the session until the Policy Engine, fed by identity, posture, activity and threat signals, decides and the Policy Administrator tells the PEP to open the path.",
     "nodes": [
      {
       "id": "idp",
       "kind": "idp",
       "label": "Identity (IdP)",
       "sub": "users, groups, MFA",
       "x": 0,
       "y": 0
      },
      {
       "id": "cdm",
       "kind": "monitor",
       "label": "Device posture",
       "sub": "CDM / EDR / MDM",
       "x": 2,
       "y": 0
      },
      {
       "id": "siem",
       "kind": "siem",
       "label": "Activity logs",
       "sub": "SIEM, UEBA",
       "x": 4,
       "y": 0
      },
      {
       "id": "ti",
       "kind": "doc",
       "label": "Threat intel",
       "sub": "feeds, risk scores",
       "x": 6,
       "y": 0
      },
      {
       "id": "pe",
       "kind": "controller",
       "label": "Policy Engine",
       "sub": "decides grant / deny",
       "x": 2,
       "y": 2
      },
      {
       "id": "pa",
       "kind": "controller",
       "label": "Policy Admin",
       "sub": "opens / closes path",
       "x": 4,
       "y": 2
      },
      {
       "id": "subj",
       "kind": "laptop",
       "label": "Subject",
       "sub": "user + device",
       "x": 0,
       "y": 4
      },
      {
       "id": "pep",
       "kind": "gateway",
       "label": "PEP",
       "sub": "proxy, gateway, port",
       "x": 3,
       "y": 4
      },
      {
       "id": "res",
       "kind": "server",
       "label": "Resource",
       "sub": "app, data, service",
       "x": 6,
       "y": 4
      }
     ],
     "links": [
      {
       "a": "idp",
       "b": "pe",
       "style": "dashed"
      },
      {
       "a": "cdm",
       "b": "pe",
       "style": "dashed"
      },
      {
       "a": "siem",
       "b": "pe",
       "style": "dashed"
      },
      {
       "a": "ti",
       "b": "pe",
       "style": "dashed"
      },
      {
       "a": "pe",
       "b": "pa",
       "label": "decision"
      },
      {
       "a": "pa",
       "b": "pep",
       "label": "control",
       "style": "dashed"
      },
      {
       "a": "subj",
       "b": "pep",
       "label": "request",
       "style": "bold"
      },
      {
       "a": "pep",
       "b": "res",
       "label": "allowed session",
       "style": "bold"
      }
     ],
     "zones": [
      {
       "label": "Control plane (PDP)",
       "x": 1,
       "y": 2,
       "w": 4,
       "h": 1,
       "tone": "accent"
      },
      {
       "label": "Data plane",
       "x": 0,
       "y": 4,
       "w": 7,
       "h": 1,
       "tone": "neutral"
      }
     ]
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "The **Policy Decision Point (PDP)** is the Policy Engine plus Policy Administrator — it decides. The **Policy Enforcement Point (PEP)** carries the decision out. In 802.1X, the NAC server is the PDP and the switch port is the PEP; on a firewall, the policy evaluation and enforcement may live in the same box.",
     "title": "PDP and PEP"
    },
    {
     "type": "compare",
     "title": "Anti-patterns and their fixes",
     "columns": [
      {
       "title": "Anti-pattern",
       "items": [
        "Flat network behind a strong perimeter",
        "VPN that grants full network access to any authenticated user",
        "Management interfaces on user VLANs",
        "One shared admin account for all devices",
        "Firewall rules added but never removed"
       ]
      },
      {
       "title": "Better pattern",
       "items": [
        "Macro-segments with default-deny between them",
        "Per-application access with device posture checks",
        "Out-of-band or management VRF reachable only from jump hosts",
        "Named admin accounts via TACACS+ with command accounting",
        "Rule owners, expiry dates and periodic recertification"
       ]
      }
     ]
    },
    {
     "type": "template",
     "title": "Architecture decision record",
     "purpose": "Record each significant security design decision so future teams understand why it was made.",
     "columns": [
      "Decision",
      "Context and threat",
      "Options considered",
      "Chosen option",
      "Consequences / trade-offs",
      "Review date"
     ],
     "example": [
      [
       "Branch internet breakout through cloud web security",
       "Backhauling all web traffic to HQ adds latency; branches are phishing targets",
       "Backhaul to HQ; local NGFW only; cloud-delivered web security",
       "Cloud-delivered web security plus local NGFW for east-west",
       "Dependency on provider; need TLS inspection policy alignment",
       "12 months"
      ]
     ],
     "rows": 5
    },
    {
     "type": "scenario",
     "title": "Remote-access redesign",
     "situation": "A garment exporter's remote-access VPN gives every authenticated user a full Layer-3 tunnel into the head-office network. Suppliers' staff also use it to reach one order-tracking web application. An audit flags this as high risk.",
     "options": [
      {
       "text": "Give suppliers per-application access to the order-tracking app only, with MFA and device checks, and restrict staff VPN to the segments their roles need",
       "feedback": "Best. It applies least privilege and removes network-level access for third parties, the biggest exposure.",
       "best": true
      },
      {
       "text": "Change the VPN pre-shared key and force all users to reconnect",
       "feedback": "Rotating a shared secret does not change what users can reach once connected.",
       "best": false
      },
      {
       "text": "Move the VPN to a different public IP address",
       "feedback": "Obscurity does not reduce access once someone connects.",
       "best": false
      }
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Defence in depth",
       "def": "Layering independent controls so that one failure does not lead to full compromise."
      },
      {
       "term": "MITRE ATT&CK",
       "def": "A public knowledge base of adversary tactics and techniques observed in real intrusions."
      },
      {
       "term": "Tactic",
       "def": "In ATT&CK, the adversary's goal at a stage of an intrusion, such as Credential Access."
      },
      {
       "term": "NIST CSF 2.0",
       "def": "An outcome-based cybersecurity framework with six functions: Govern, Identify, Protect, Detect, Respond and Recover."
      },
      {
       "term": "Profile (CSF)",
       "def": "A description of current or target cybersecurity outcomes, used to identify gaps."
      },
      {
       "term": "ALE",
       "def": "Annualised loss expectancy: single loss expectancy multiplied by the annual rate of occurrence."
      },
      {
       "term": "Macro-segmentation",
       "def": "Separating large environments, such as production and guest, using VRFs or firewalls."
      },
      {
       "term": "Micro-segmentation",
       "def": "Policy between individual workloads or user groups, often using identity tags or host firewalls."
      },
      {
       "term": "Blast radius",
       "def": "The set of systems an attacker or failure can affect from a given foothold."
      },
      {
       "term": "Zero trust",
       "def": "A security model in which no implicit trust is granted by network location; every access request is verified."
      },
      {
       "term": "Policy Enforcement Point",
       "def": "The component that allows or blocks a session based on a policy decision."
      },
      {
       "term": "Policy Decision Point",
       "def": "The policy engine and administrator that evaluate requests and instruct enforcement points."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Which anti-pattern from this lesson exists in a network you know? Draft the first two steps to remove it without causing an outage."
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "Reuse reference patterns per place in the network: campus, branch, data centre, cloud and remote users.",
      "Publish services and terminate VPNs in a DMZ; control east-west with internal segmentation and an out-of-band management plane.",
      "Zero trust (NIST SP 800-207) removes trust by location: a PEP enforces each session, the PE and PA decide and instruct.",
      "Record significant design decisions with their trade-offs so future teams know why."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "In NIST SP 800-207, which component actually allows or blocks the session?",
       "options": [
        "The Policy Engine",
        "The subject's endpoint agent",
        "The Policy Enforcement Point",
        "The certificate authority"
       ],
       "answer": 2,
       "explain": "The PEP enforces. The Policy Engine decides, and the endpoint and CA provide signals or credentials but do not enforce access."
      },
      {
       "q": "Which statement reflects a zero-trust principle?",
       "options": [
        "Users on the VPN can be trusted fully because all of their traffic is encrypted end to end",
        "Only internet-facing servers need access policy",
        "Connecting from the corporate LAN does not by itself grant access to a resource",
        "Device posture is checked once a year during audits"
       ],
       "answer": 2,
       "explain": "Zero trust removes implicit trust from network location and evaluates every request. Encryption is not trust, all resources need policy, and posture is checked continuously."
      },
      {
       "q": "In an 802.1X deployment, which device acts as the PEP?",
       "options": [
        "The access switch or wireless controller enforcing the port or session",
        "The NAC server that evaluates the authorisation policy for each request",
        "The directory service holding user accounts and group memberships",
        "The SIEM collecting authentication logs"
       ],
       "answer": 0,
       "explain": "The switch or controller enforces; the NAC server is the decision point; the directory is an identity source; the SIEM observes."
      },
      {
       "q": "A branch design sends all web traffic to HQ for inspection, causing latency complaints. Which pattern addresses this while keeping inspection?",
       "options": [
        "Removing web inspection for branch users to cut latency entirely",
        "Adding more bandwidth to the backhaul links only",
        "Allowing direct internet access with no policy at branches",
        "Local internet breakout through cloud-delivered web security"
       ],
       "answer": 3,
       "explain": "Cloud-delivered security keeps inspection close to users. Removing inspection or allowing unmanaged breakout increases risk; more bandwidth may not fix latency."
      },
      {
       "q": "What is the main purpose of an architecture decision record?",
       "options": [
        "To replace change-management approvals for firewall and routing changes",
        "To preserve the reasoning and trade-offs behind a security design choice",
        "To list every device serial number in the network",
        "To store device configuration backups used during disaster recovery tests"
       ],
       "answer": 1,
       "explain": "ADRs capture why a decision was made. They complement change control, inventories and backups but do not replace them."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m2",
 "order": 2,
 "code": "Perimeter",
 "title": "Next-Generation Firewalls",
 "subtitle": "Design, build and operate stateful, application- and identity-aware firewall policy that stays clean and resilient",
 "outcomes": [
  "Design zone models and least-privilege rule bases on stateful firewalls",
  "Configure NAT and write application- and user-based policy correctly",
  "Plan TLS inspection with documented privacy exceptions and integrate IPS safely",
  "Build and test high-availability firewall designs",
  "Audit rule bases and troubleshoot flows with logs, traces and packet captures"
 ],
 "lessons": [
  {
   "id": "m2-l1",
   "title": "Stateful Inspection, Zones and Policy Design",
   "subtitle": "How a firewall tracks sessions, and how to build a zone model and rule base that stay clean",
   "minutes": 28,
   "objectives": [
    "Explain how stateful inspection tracks sessions and handles return traffic",
    "Design security zones and an inter-zone policy matrix",
    "Order rules correctly and apply default deny with logging",
    "Configure a basic zone-based policy in IOS-style syntax"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "A **stateful firewall** remembers connections. When an inside host opens a TCP session to a web server, the firewall records the 5-tuple (source and destination address, source and destination port, protocol), the TCP state and timers. Return packets are allowed because they match that entry — not because a rule permits them. Packets that match no session and no rule are dropped."
    },
    {
     "type": "sequence",
     "title": "Return traffic matches state, not a rule",
     "caption": "Only the first packet is checked against the rule base; everything after it, in both directions, is forwarded because it fits the stored session. That is why no OUTSIDE-to-INSIDE rule is needed for replies.",
     "actors": [
      "Client 10.10.4.21",
      "Stateful firewall",
      "Server 203.0.113.50"
     ],
     "steps": [
      {
       "from": 0,
       "to": 1,
       "label": "SYN to 203.0.113.50:443"
      },
      {
       "from": 1,
       "to": 1,
       "label": "No session: policy lookup = allow",
       "note": "5-tuple entry created"
      },
      {
       "from": 1,
       "to": 2,
       "label": "SYN forwarded"
      },
      {
       "from": 2,
       "to": 1,
       "label": "SYN-ACK",
       "note": "matches the session, no rule needed",
       "reply": true
      },
      {
       "from": 1,
       "to": 0,
       "label": "SYN-ACK forwarded",
       "reply": true
      },
      {
       "from": 0,
       "to": 1,
       "label": "ACK and data"
      },
      {
       "from": 1,
       "to": 2,
       "label": "Fast path: forwarded by session match"
      },
      {
       "from": 0,
       "to": 1,
       "label": "FIN or RST (or idle timeout)"
      },
      {
       "from": 1,
       "to": 1,
       "label": "Entry removed, session-end log"
      }
     ]
    },
    {
     "type": "flow",
     "title": "Life of a new session through a stateful firewall",
     "items": [
      {
       "label": "Packet arrives",
       "text": "Ingress interface identifies the source zone"
      },
      {
       "label": "Session lookup",
       "text": "Existing session? Fast-path forward and update state"
      },
      {
       "label": "Policy lookup",
       "text": "New flow: match zones, addresses, application, user, service"
      },
      {
       "label": "NAT and inspection",
       "text": "Apply translation, IPS and other security profiles"
      },
      {
       "label": "Session created",
       "text": "Entry stored with timers; return traffic matches it"
      },
      {
       "label": "Session closes",
       "text": "FIN/RST or idle timeout removes the entry and logs the end"
      }
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Every session consumes memory. SYN floods and scanning bursts aim to exhaust the session table. Next-generation firewalls defend with SYN cookies or SYN proxy, per-source session limits and aggressive timeouts for half-open connections — tune them before an attack, not during one.",
     "title": "State is also a resource"
    },
    {
     "type": "table",
     "title": "Stateful versus stateless filtering",
     "head": [
      "Aspect",
      "Stateless ACL",
      "Stateful firewall"
     ],
     "rows": [
      [
       "Return traffic",
       "Needs an explicit reverse rule or the 'established' bit check",
       "Allowed automatically by session match"
      ],
      [
       "Protocols with dynamic ports (FTP, SIP)",
       "Hard to permit safely",
       "Helpers open only the negotiated ports for that session"
      ],
      [
       "Spoofed mid-session packets",
       "Often passed if headers match",
       "Dropped if sequence or state does not fit"
      ],
      [
       "Performance",
       "Very fast, hardware friendly",
       "More resource use; sessions must be tracked"
      ],
      [
       "Typical place",
       "Infrastructure ACLs, router edges, control-plane protection",
       "Perimeter, internal segmentation, DMZ"
      ]
     ]
    },
    {
     "type": "text",
     "text": "A **zone** is a group of interfaces that share a trust level. Policy is written between zones (source zone to destination zone), so adding a new interface to an existing zone automatically inherits the correct policy. Most platforms deny traffic between zones by default and allow traffic within a zone unless configured otherwise — know which applies to your platform."
    },
    {
     "type": "table",
     "title": "Example inter-zone policy matrix",
     "head": [
      "From ↓ / To →",
      "INSIDE",
      "DMZ",
      "OUTSIDE",
      "MGMT"
     ],
     "rows": [
      [
       "INSIDE",
       "Intra-zone (review)",
       "HTTPS to web tier only",
       "Web, DNS to resolvers, approved SaaS",
       "Deny"
      ],
      [
       "DMZ",
       "Specific app ports to named servers only",
       "Deny by default",
       "OS updates from approved sources",
       "Deny"
      ],
      [
       "OUTSIDE",
       "Deny",
       "HTTPS to published services",
       "—",
       "Deny"
      ],
      [
       "MGMT",
       "SSH, SNMPv3 to devices",
       "SSH to DMZ hosts",
       "Updates to vendor portals",
       "Intra-zone"
      ]
     ]
    },
    {
     "type": "topology",
     "title": "Four zones, one enforcement point",
     "caption": "Each interface belongs to one zone and every cell of the policy matrix is a zone pair on this firewall. Adding another inside interface to INSIDE gives it the INSIDE policy automatically.",
     "nodes": [
      {
       "id": "inet",
       "kind": "internet",
       "label": "Internet",
       "sub": "OUTSIDE zone",
       "x": 3,
       "y": 0
      },
      {
       "id": "fw",
       "kind": "firewall",
       "label": "FW-EDGE",
       "sub": "zone-based policy",
       "x": 3,
       "y": 2
      },
      {
       "id": "dmz",
       "kind": "server",
       "label": "Web tier",
       "sub": "DMZ 172.16.10.0/24",
       "x": 6,
       "y": 2
      },
      {
       "id": "usr",
       "kind": "user",
       "label": "Staff",
       "sub": "INSIDE 10.10.0.0/16",
       "x": 1,
       "y": 4
      },
      {
       "id": "mgmt",
       "kind": "monitor",
       "label": "Admin hosts",
       "sub": "MGMT 10.250.0.0/24",
       "x": 5,
       "y": 4
      }
     ],
     "links": [
      {
       "a": "inet",
       "b": "fw",
       "bEnd": "Gi0/1"
      },
      {
       "a": "fw",
       "b": "dmz",
       "label": "HTTPS only",
       "aEnd": "Gi0/2"
      },
      {
       "a": "fw",
       "b": "usr",
       "aEnd": "Gi0/0"
      },
      {
       "a": "fw",
       "b": "mgmt",
       "label": "SSH, SNMPv3",
       "style": "dashed",
       "aEnd": "Gi0/3"
      }
     ],
     "zones": [
      {
       "label": "OUTSIDE",
       "x": 2,
       "y": 0,
       "w": 3,
       "h": 1,
       "tone": "bad"
      },
      {
       "label": "DMZ",
       "x": 6,
       "y": 2,
       "w": 1,
       "h": 1,
       "tone": "warn"
      },
      {
       "label": "INSIDE",
       "x": 0,
       "y": 4,
       "w": 3,
       "h": 1,
       "tone": "good"
      },
      {
       "label": "MGMT",
       "x": 4,
       "y": 4,
       "w": 2,
       "h": 1,
       "tone": "accent"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Zone-based policy: inside users to the internet",
     "device": "FW-EDGE · IOS-style CLI",
     "lines": [
      "zone security INSIDE",
      "zone security OUTSIDE",
      "class-map type inspect match-any CM-WEB-DNS",
      " match protocol https",
      " match protocol http",
      " match protocol dns",
      "policy-map type inspect PM-IN-TO-OUT",
      " class type inspect CM-WEB-DNS",
      "  inspect",
      " class class-default",
      "  drop log",
      "zone-pair security ZP-IN-OUT source INSIDE destination OUTSIDE",
      " service-policy type inspect PM-IN-TO-OUT",
      "interface GigabitEthernet0/0",
      " zone-member security INSIDE",
      "interface GigabitEthernet0/1",
      " zone-member security OUTSIDE"
     ],
     "note": "No zone-pair exists from OUTSIDE to INSIDE, so unsolicited inbound traffic is dropped; return traffic for inspected sessions is permitted by state."
    },
    {
     "type": "framework",
     "title": "Rule-base design principles",
     "items": [
      {
       "label": "R1",
       "title": "Most specific first",
       "text": "Rules are evaluated top-down, first match wins; broad rules go lower."
      },
      {
       "label": "R2",
       "title": "Explicit default deny",
       "text": "End each zone pair with a deny-and-log rule so drops are visible."
      },
      {
       "label": "R3",
       "title": "Objects, not raw IPs",
       "text": "Use named address and service groups so intent is readable and reusable."
      },
      {
       "label": "R4",
       "title": "One purpose per rule",
       "text": "Each rule has a business justification, owner and ticket reference."
      },
      {
       "label": "R5",
       "title": "Least privilege",
       "text": "Narrow sources, destinations, applications and ports; avoid 'any' in more than one field."
      }
     ]
    },
    {
     "type": "scenario",
     "title": "Inbound access request",
     "situation": "An application team asks for 'any to the DMZ web server on any port' to 'make the vendor integration work'. The vendor's integration documentation lists HTTPS (TCP 443) from two published source ranges.",
     "options": [
      {
       "text": "Permit any source to the server on any port, then tighten later",
       "feedback": "Temporary broad rules are rarely tightened and expose every service on the host.",
       "best": false
      },
      {
       "text": "Permit only TCP 443 from the vendor's two published ranges to the web server, with logging and an expiry review",
       "feedback": "Correct. It matches the documented need exactly and keeps the rule auditable.",
       "best": true
      },
      {
       "text": "Permit the vendor ranges on any port to the whole DMZ",
       "feedback": "This exposes other DMZ servers and unnecessary ports.",
       "best": false
      },
      {
       "text": "Refuse the request until the vendor moves to a VPN",
       "feedback": "Blocking a documented, narrow HTTPS integration is unnecessary; least-privilege rules handle it.",
       "best": false
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Sketch the zone matrix of a firewall you manage. Which cell is the broadest today, and what evidence would you need to narrow it?"
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "A stateful firewall checks the rule base for the first packet only; replies and later packets match the session entry.",
      "The session table is a finite resource: protect it with SYN cookies or proxy, per-source limits and short half-open timers.",
      "Write policy between zones, end every zone pair with deny-and-log, and use named objects.",
      "Every rule needs one purpose, an owner, a ticket and the narrowest sources, destinations and applications that work."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Why does a stateful firewall allow return traffic without a matching inbound rule?",
       "options": [
        "Return packets match the session entry created by the outbound flow",
        "Return traffic always uses well-known ports that are permitted by default",
        "The firewall automatically creates a permanent reverse rule",
        "All TCP packets with the ACK flag set are trusted"
       ],
       "answer": 0,
       "explain": "State tracking matches return packets to the session. No permanent reverse rule is created and the ACK flag alone is not trusted."
      },
      {
       "q": "A new interface is added to the DMZ zone. What happens to policy?",
       "options": [
        "It has no policy until a rule is written for that interface",
        "It is automatically placed in the default inside zone",
        "It inherits the existing policies written for the DMZ zone",
        "All traffic to it is permitted until the next commit"
       ],
       "answer": 2,
       "explain": "Zone-based policy is written between zones, so interfaces inherit zone policy. That is a key benefit of the zone model."
      },
      {
       "q": "In the IOS-style example, why is no OUTSIDE-to-INSIDE zone pair configured?",
       "options": [
        "Because return traffic must be explicitly permitted by a second, separate inspect policy",
        "Because inbound traffic is then dropped unless it returns on an inspected session",
        "Because zone pairs can only be defined in one direction on each device",
        "Because the class-default drop rule already permits the inbound sessions"
       ],
       "answer": 1,
       "explain": "Without a zone pair, inter-zone traffic is denied; inspected sessions allow return packets through state. Zone pairs can be defined in either direction."
      },
      {
       "q": "Which rule-base practice best supports later audits?",
       "options": [
        "Rules use raw IP addresses so that auditors can see the exact hosts involved",
        "Rules are grouped by the date they were created",
        "Broad rules are placed at the top for faster matching",
        "Each rule has an owner, business justification and ticket reference"
       ],
       "answer": 3,
       "explain": "Ownership and justification make rules reviewable. Objects improve readability over raw IPs, and broad rules at the top shadow specific ones."
      },
      {
       "q": "Which defence helps most against session-table exhaustion from SYN floods?",
       "options": [
        "Increasing the TCP idle timeout for established sessions to several hours",
        "SYN cookies or SYN proxy with limits on half-open sessions per source",
        "Allowing all TCP traffic from the outside zone to the DMZ",
        "Disabling logging for denied packets to save CPU"
       ],
       "answer": 1,
       "explain": "SYN protection and half-open limits protect the table. Longer timeouts and broader rules worsen exhaustion; disabling logs removes visibility."
      }
     ]
    }
   ]
  },
  {
   "id": "m2-l2",
   "title": "NAT, Application Identification and User-Based Policy",
   "subtitle": "Translate addresses safely and write policy around applications and people instead of ports and IPs",
   "minutes": 28,
   "objectives": [
    "Configure source NAT (PAT) and static destination NAT for published services",
    "Explain how NAT interacts with security policy lookup",
    "Describe how application identification works and where it can be wrong",
    "Design user- and group-based firewall rules using identity sources"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Network Address Translation is not a security control by design, but it shapes every firewall policy. You must know **which address the policy sees** — the original or the translated one — and that varies between platforms. Get it wrong and rules silently fail to match."
    },
    {
     "type": "table",
     "title": "NAT types you will configure",
     "head": [
      "Type",
      "What changes",
      "Typical use"
     ],
     "rows": [
      [
       "Source NAT with port translation (PAT)",
       "Many inside sources share one public address with unique ports",
       "User internet access"
      ],
      [
       "Static source NAT (one-to-one)",
       "A fixed inside host always appears as one public address",
       "Servers that initiate outbound connections needing a stable IP"
      ],
      [
       "Destination NAT / port forward",
       "Public address and port map to an inside server",
       "Publishing a DMZ service"
      ],
      [
       "Twice NAT / policy NAT",
       "Source and destination both change, or translation depends on the destination",
       "Overlapping address spaces between partners"
      ],
      [
       "NAT exemption",
       "No translation for selected traffic",
       "Site-to-site VPN traffic between private networks"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "PAT for users and a published HTTPS server",
     "device": "R-EDGE · IOS-style CLI",
     "lines": [
      "interface GigabitEthernet0/0",
      " ip nat inside",
      "interface GigabitEthernet0/2",
      " ip nat inside",
      "interface GigabitEthernet0/1",
      " ip nat outside",
      "ip access-list standard NAT-USERS",
      " permit 10.10.0.0 0.0.255.255",
      "ip nat inside source list NAT-USERS interface GigabitEthernet0/1 overload",
      "! Publish DMZ web server 10.20.0.10:443 on public 203.0.113.10:443",
      "ip nat inside source static tcp 10.20.0.10 443 203.0.113.10 443"
     ],
     "note": "The DMZ interface (Gi0/2) is also marked inside so the static translation applies to the server. Permit the inbound flow in the firewall policy as well — NAT alone does not allow it."
    },
    {
     "type": "topology",
     "title": "PAT for users, static NAT for a published server",
     "caption": "Outbound user sessions share the outside interface address with unique ports; inbound HTTPS to 203.0.113.10 is translated to 10.20.0.10. The translation alone permits nothing: a security rule must still allow the flow.",
     "nodes": [
      {
       "id": "cli",
       "kind": "laptop",
       "label": "Remote client",
       "sub": "198.51.100.27",
       "x": 0,
       "y": 0
      },
      {
       "id": "inet",
       "kind": "internet",
       "label": "Internet",
       "x": 3,
       "y": 0
      },
      {
       "id": "edge",
       "kind": "router",
       "label": "R-EDGE",
       "sub": "PAT + static NAT",
       "x": 3,
       "y": 2
      },
      {
       "id": "usr",
       "kind": "user",
       "label": "Users",
       "sub": "10.10.0.0/16, PAT outbound",
       "x": 1,
       "y": 4
      },
      {
       "id": "web",
       "kind": "server",
       "label": "web01",
       "sub": "10.20.0.10 = 203.0.113.10:443",
       "x": 5,
       "y": 4
      }
     ],
     "links": [
      {
       "a": "cli",
       "b": "inet",
       "label": "to 203.0.113.10:443"
      },
      {
       "a": "inet",
       "b": "edge",
       "bEnd": "Gi0/1 outside"
      },
      {
       "a": "edge",
       "b": "usr",
       "aEnd": "Gi0/0 inside"
      },
      {
       "a": "edge",
       "b": "web",
       "label": "static NAT",
       "aEnd": "Gi0/2 inside"
      }
     ],
     "zones": [
      {
       "label": "Inside",
       "x": 0,
       "y": 4,
       "w": 3,
       "h": 1,
       "tone": "good"
      },
      {
       "label": "DMZ",
       "x": 4,
       "y": 4,
       "w": 2,
       "h": 1,
       "tone": "warn"
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Some platforms evaluate security rules against the **pre-NAT** (public) destination, others against the **post-NAT** (private) destination, and many use a mix (original destination address with translated zone). Before writing a rule for a published service, confirm your platform's order of operations in a lab or with a packet-trace tool.",
     "title": "Policy versus translated address"
    },
    {
     "type": "cli",
     "title": "Confirming the session and translation",
     "device": "FW1 · generic NGFW CLI",
     "lines": [
      "fw1> show session all filter destination 203.0.113.10",
      "ID     App   State   Src                  Dst              Xlated-Dst       Zones",
      "48211  ssl   ACTIVE  198.51.100.27:51522  203.0.113.10:443 10.20.0.10:443   untrust->dmz",
      "48230  ssl   ACTIVE  192.0.2.44:60310     203.0.113.10:443 10.20.0.10:443   untrust->dmz"
     ],
     "note": "Illustrative output. The translated destination and the zone pair confirm both NAT and policy matched as intended."
    },
    {
     "type": "text",
     "text": "**Application identification** classifies traffic by what it is, not by the port it uses. The firewall examines the first packets and the TLS handshake (for example the SNI and certificate), applies protocol decoders and signatures, and may update the classification as the session progresses. This lets you allow a collaboration suite while blocking its file-transfer feature, or block remote-access tools on port 443."
    },
    {
     "type": "compare",
     "title": "Port-based versus application-based rules",
     "columns": [
      {
       "title": "Port-based",
       "items": [
        "Allow TCP 443 to any",
        "Any application tunnelling over 443 passes",
        "Easy to write, hard to reason about",
        "Cannot separate features of one service"
       ]
      },
      {
       "title": "Application-based",
       "items": [
        "Allow named applications (and their default ports)",
        "Unknown or evasive traffic can be denied",
        "Needs signature updates and tuning",
        "Can control features such as upload or remote control"
       ]
      }
     ]
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "Encrypted traffic limits visibility: without TLS inspection, classification relies on SNI, certificate fields and traffic patterns. **Encrypted Client Hello (ECH)** hides the real SNI, and QUIC (HTTP/3 over UDP 443) changes the handshake. Many organisations block QUIC at the firewall so browsers fall back to TCP, where inspection is more mature — document this choice and its trade-offs.",
     "title": "Application identification limits"
    },
    {
     "type": "text",
     "text": "**User-based policy** maps IP addresses to users and groups so rules can say 'Finance group may reach the payment system'. The mapping comes from identity sources: NAC/RADIUS accounting, directory login events, VPN logins, captive portals or agents. The rule is only as accurate as that mapping."
    },
    {
     "type": "table",
     "title": "Identity sources for user-to-IP mapping",
     "head": [
      "Source",
      "Strength",
      "Watch out for"
     ],
     "rows": [
      [
       "NAC / RADIUS accounting",
       "Accurate for wired and wireless 802.1X sessions",
       "Needs accounting start/stop and interim updates"
      ],
      [
       "VPN gateway logins",
       "Precise for remote users",
       "Only covers VPN-connected sessions"
      ],
      [
       "Directory login events",
       "Broad coverage on managed Windows estates",
       "Shared or multi-user hosts create wrong mappings"
      ],
      [
       "Captive portal",
       "Works for unmanaged or guest devices",
       "User friction; mapping ends at timeout"
      ],
      [
       "Terminal-server agents",
       "Distinguishes many users on one IP by port ranges",
       "Extra software on multi-user servers"
      ]
     ]
    },
    {
     "type": "scenario",
     "title": "Group rule not matching",
     "situation": "A rule allows the 'Payroll' group to reach the payroll application. A payroll clerk on a shared Citrix-style terminal server is blocked, while a call-centre user on the same server can reach payroll.",
     "options": [
      {
       "text": "The payroll application's signature is out of date",
       "feedback": "An application signature problem would affect everyone equally, not depend on the user.",
       "best": false
      },
      {
       "text": "Add the call-centre group to the payroll rule to make it consistent",
       "feedback": "This grants access to the wrong people and hides the real fault.",
       "best": false
      },
      {
       "text": "The terminal server's single IP is mapped to whoever logged in last; deploy a multi-user agent or move payroll access to per-user application access",
       "feedback": "Correct. IP-to-user mapping breaks on multi-user hosts; port-range agents or per-application access fix it.",
       "best": true
      }
     ]
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "NAT is not a security control, but you must know whether policy matches the pre-NAT or post-NAT address on your platform.",
      "Use PAT for users, static NAT for published services and NAT exemption for site-to-site VPN traffic.",
      "Application identification classifies by behaviour and handshake data; ECH and QUIC reduce what it can see without a full proxy.",
      "User-based rules are only as accurate as the user-to-IP mapping; multi-user hosts need agents or per-application access."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A user rule references the 'Engineering' group but matches nothing. Logs show traffic from the correct IPs. What is the most likely cause?",
       "options": [
        "The application signature database is out of date on the firewall pair",
        "The NAT pool has run out of public ports",
        "The rule is placed below the explicit default-deny rule",
        "The firewall has no current user-to-IP mapping for those addresses"
       ],
       "answer": 3,
       "explain": "If traffic arrives but the user field is empty, identity mapping is missing. A rule below default deny would never be hit, but the user field would still show the user."
      },
      {
       "q": "Why must you confirm whether policy is evaluated pre-NAT or post-NAT?",
       "options": [
        "A rule using the wrong destination address will not match the published service",
        "NAT disables application identification on most current firewall platforms",
        "Only post-NAT rules can be logged to the SIEM by the firewall's log forwarder",
        "Pre-NAT rules cannot reference security zones, so they must be rewritten after translation"
       ],
       "answer": 0,
       "explain": "Platforms differ in which address the rule sees; a mismatch makes rules silently fail. NAT does not disable application identification or logging."
      },
      {
       "q": "Which NAT type is used so site-to-site VPN traffic keeps its private addresses?",
       "options": [
        "Port address translation to the outside interface address",
        "Static destination NAT for the remote subnet",
        "NAT exemption for traffic between the two private networks",
        "Dynamic source NAT from a pool of public addresses at each site"
       ],
       "answer": 2,
       "explain": "VPN traffic between private networks is typically exempted so the selectors match. PAT or dynamic NAT would change addresses and break the tunnel's traffic selectors."
      },
      {
       "q": "What weakens application identification on encrypted traffic without TLS inspection?",
       "options": [
        "Use of IPv4 rather than IPv6 addressing on the inside",
        "Running applications on their default ports",
        "Encrypted Client Hello hiding the real server name",
        "Having many users behind a single NAT address"
       ],
       "answer": 2,
       "explain": "ECH removes the SNI hint that classification relies on. IP version, default ports and NAT do not materially reduce application visibility."
      },
      {
       "q": "Why do many organisations block QUIC (UDP 443) at the firewall?",
       "options": [
        "Browsers then fall back to TCP-based TLS, where inspection is more mature",
        "QUIC traffic cannot be translated by NAT devices and breaks internet access",
        "QUIC is used almost exclusively by malware families for command and control",
        "Blocking QUIC improves video streaming quality"
       ],
       "answer": 0,
       "explain": "Blocking QUIC is a visibility trade-off. QUIC works through NAT, is widely used legitimately and blocking it does not improve streaming."
      }
     ]
    }
   ]
  },
  {
   "id": "m2-l3",
   "title": "TLS Inspection and IPS Integration",
   "subtitle": "See inside encrypted traffic where it is justified, protect privacy where it is not, and tune intrusion prevention",
   "minutes": 30,
   "objectives": [
    "Explain outbound (forward proxy) and inbound TLS inspection",
    "Design a decryption policy with privacy and technical exceptions",
    "Integrate IPS profiles into firewall rules without crippling performance",
    "Recognise how TLS 1.3, pinning and ECH affect inspection"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Most traffic is encrypted. Without inspection, malware delivery, command-and-control and data exfiltration over HTTPS look like ordinary web browsing. **TLS inspection** lets the firewall decrypt, inspect and re-encrypt — but it also breaks end-to-end trust, raises privacy and legal questions and costs significant performance. Expert design means deciding *what* to decrypt, not just *whether*."
    },
    {
     "type": "compare",
     "title": "Two inspection modes",
     "columns": [
      {
       "title": "Outbound (forward proxy)",
       "items": [
        "Protects users browsing the internet",
        "Firewall generates a substitute certificate signed by an internal CA",
        "Clients must trust that internal CA",
        "Firewall validates the real server certificate on the user's behalf"
       ]
      },
      {
       "title": "Inbound (server protection)",
       "items": [
        "Protects your own published servers",
        "Firewall holds the server's certificate and private key, or terminates TLS as a reverse proxy",
        "No client changes needed",
        "Lets IPS see attacks aimed at your applications"
       ]
      }
     ]
    },
    {
     "type": "sequence",
     "title": "Outbound TLS inspection (forward proxy)",
     "caption": "There are two separate TLS sessions: browser to proxy and proxy to server. The proxy validates the real certificate on the user's behalf, so it must block bad certificates rather than hide them.",
     "actors": [
      "Browser",
      "NGFW proxy",
      "Web server"
     ],
     "steps": [
      {
       "from": 0,
       "to": 1,
       "label": "ClientHello (SNI shop.example)",
       "note": "intercepted"
      },
      {
       "from": 1,
       "to": 1,
       "label": "Policy: category, app, exceptions",
       "note": "decrypt or bypass?"
      },
      {
       "from": 1,
       "to": 2,
       "label": "Own ClientHello to the real server"
      },
      {
       "from": 2,
       "to": 1,
       "label": "ServerHello + real certificate",
       "reply": true
      },
      {
       "from": 1,
       "to": 1,
       "label": "Validate real cert; block if bad"
      },
      {
       "from": 1,
       "to": 0,
       "label": "Substitute cert from inspection CA",
       "reply": true
      },
      {
       "from": 0,
       "to": 1,
       "label": "Encrypted request (session A)"
      },
      {
       "from": 1,
       "to": 1,
       "label": "Decrypt: IPS, malware, data rules"
      },
      {
       "from": 1,
       "to": 2,
       "label": "Re-encrypted request (session B)"
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Because the user's browser sees only the firewall's certificate, the firewall must **block** sessions to servers with expired, untrusted or mismatched certificates. Inspection that silently accepts bad certificates makes users less safe than no inspection at all.",
     "title": "The firewall now owns server validation"
    },
    {
     "type": "table",
     "title": "Decryption exception categories",
     "head": [
      "Category",
      "Reason to bypass",
      "Compensating control"
     ],
     "rows": [
      [
       "Health and medical sites",
       "Privacy and legal obligations",
       "Category and reputation filtering without decryption"
      ],
      [
       "Banking and financial services",
       "Privacy; many sites detect interception",
       "Reputation checks, DNS security"
      ],
      [
       "Pinned applications (mobile apps, update services)",
       "Certificate pinning makes interception fail",
       "Allow by application and destination; monitor flows"
      ],
      [
       "Mutual-TLS client authentication",
       "The firewall cannot present the client's certificate",
       "Restrict destinations; inspect at the endpoint"
      ],
      [
       "Legally protected communications (e.g. HR, legal counsel portals)",
       "Policy and works-council agreements",
       "Documented exemption with owner approval"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "Before enabling decryption, agree a written policy with legal, HR and privacy owners: what is decrypted, who can see decrypted data, how long logs are kept and how users are informed. In many jurisdictions this is a legal requirement, not just good manners.",
     "title": "Governance first"
    },
    {
     "type": "table",
     "title": "Modern TLS realities",
     "head": [
      "Development",
      "Effect on inspection"
     ],
     "rows": [
      [
       "TLS 1.3",
       "Server certificate is encrypted in the handshake, so passive inspection cannot read it; full proxy is needed for content"
      ],
      [
       "Encrypted Client Hello (ECH)",
       "Real server name hidden from passive observers; policy relies on DNS controls or full proxy"
      ],
      [
       "Certificate pinning",
       "Apps refuse substitute certificates; they must be exempted or will break"
      ],
      [
       "QUIC / HTTP/3",
       "UDP-based; many platforms inspect it less maturely, often blocked to force TCP fallback"
      ],
      [
       "Post-quantum hybrid key exchange",
       "Mainstream browsers and TLS libraries now offer a hybrid group (classical X25519 combined with ML-KEM, e.g. X25519MLKEM768) by default. ClientHellos grow beyond one packet, which breaks some older middleboxes, and a proxy that only supports classical groups silently removes the post-quantum protection on the user side; check inspection devices for hybrid support"
      ]
     ]
    },
    {
     "type": "sequence",
     "title": "TLS 1.3 full handshake (one round trip)",
     "caption": "Braces mark messages already encrypted with handshake keys: the server certificate is no longer visible to passive devices, and with ECH the real server name is hidden too. Only a full proxy or the endpoint can see content.",
     "actors": [
      "Client",
      "Server"
     ],
     "steps": [
      {
       "from": 0,
       "to": 1,
       "label": "ClientHello + key_share",
       "note": "e.g. X25519MLKEM768 and X25519"
      },
      {
       "from": 1,
       "to": 0,
       "label": "ServerHello + key_share",
       "note": "handshake keys derived",
       "reply": true
      },
      {
       "from": 1,
       "to": 0,
       "label": "{EncryptedExtensions}",
       "note": "encrypted from here on",
       "reply": true
      },
      {
       "from": 1,
       "to": 0,
       "label": "{Certificate}",
       "note": "hidden from passive devices",
       "reply": true
      },
      {
       "from": 1,
       "to": 0,
       "label": "{CertificateVerify}",
       "reply": true
      },
      {
       "from": 1,
       "to": 0,
       "label": "{Finished}",
       "reply": true
      },
      {
       "from": 0,
       "to": 1,
       "label": "{Finished}"
      },
      {
       "from": 0,
       "to": 1,
       "label": "[Application data]"
      },
      {
       "from": 1,
       "to": 0,
       "label": "[Application data]",
       "reply": true
      }
     ]
    },
    {
     "type": "text",
     "text": "An **intrusion prevention system (IPS)** integrated into the firewall applies signatures and protocol-anomaly checks to permitted traffic. Attach IPS profiles to *allow* rules — dropped traffic needs no inspection. Tune by risk: strict profiles on inbound DMZ traffic and server zones, balanced profiles on user browsing."
    },
    {
     "type": "steps",
     "title": "Bringing IPS into production safely",
     "items": [
      {
       "title": "Baseline",
       "text": "Enable the vendor-recommended profile in alert-only mode on a pilot rule set."
      },
      {
       "title": "Review",
       "text": "Analyse alerts for false positives against known applications for one to two weeks."
      },
      {
       "title": "Exception",
       "text": "Create narrow exceptions (signature + host), never disabling a whole category."
      },
      {
       "title": "Block",
       "text": "Switch high-confidence, high-severity signatures to block first, then expand."
      },
      {
       "title": "Maintain",
       "text": "Automate signature updates and review performance and exceptions monthly."
      }
     ]
    },
    {
     "type": "cli",
     "title": "IPS alert in the firewall threat log",
     "device": "FW1 · generic NGFW CLI",
     "lines": [
      "fw1> show log threat direction both severity critical last 1",
      "time=2026-05-14T09:12:44Z rule=DMZ-WEB-IN action=reset-both",
      "src=198.51.100.80 dst=10.20.0.10 dport=443 app=web-browsing decrypted=yes",
      "threat=\"HTTP Server Remote Code Execution Attempt\" id=94211 severity=critical",
      "zone=untrust->dmz session=48912"
     ],
     "note": "Illustrative output. `decrypted=yes` shows the inbound inspection rule made this detection possible; without it the exploit payload would have been invisible."
    },
    {
     "type": "scenario",
     "title": "Decryption rollout complaint",
     "situation": "After enabling outbound TLS inspection for all staff, the help desk reports that a mobile banking app on company phones and the endpoint agent's update service both fail with certificate errors. The CISO asks for a fix today.",
     "options": [
      {
       "text": "Add narrow decryption exceptions for the pinned app and update-service destinations, and keep inspection for everything else",
       "feedback": "Correct. Pinned services cannot be intercepted; exempting them by destination restores function while preserving inspection elsewhere.",
       "best": true
      },
      {
       "text": "Disable TLS inspection organisation-wide until the vendor releases a fix",
       "feedback": "This removes visibility for all traffic to fix two known, expected exceptions.",
       "best": false
      },
      {
       "text": "Configure the firewall to accept any server certificate to avoid errors",
       "feedback": "This would hide genuine man-in-the-middle and certificate problems from users.",
       "best": false
      },
      {
       "text": "Ask users to click through the certificate warnings",
       "feedback": "Training users to ignore warnings is dangerous and would not work for pinned apps anyway.",
       "best": false
      }
     ]
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "Decide what to decrypt, not just whether: written policy with legal, HR and privacy owners comes first.",
      "Outbound inspection runs two TLS sessions; the proxy must validate real certificates and block bad ones.",
      "Exempt pinned apps, mutual-TLS services and protected categories, with compensating controls.",
      "TLS 1.3, ECH, QUIC and hybrid post-quantum key exchange all reduce passive visibility; check proxies support them.",
      "Attach IPS to allow rules, start alert-only, and move to blocking in tuned stages."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "In outbound TLS inspection, what must clients trust?",
       "options": [
        "The public CA of every website they visit, as they always do",
        "A self-signed certificate installed on each destination web server",
        "The firewall's own management interface web certificate",
        "The internal CA that signs the firewall's substitute certificates"
       ],
       "answer": 3,
       "explain": "Clients see certificates minted by the firewall, so the internal inspection CA must be in their trust store."
      },
      {
       "q": "Why must a firewall performing TLS inspection block sessions to servers with invalid certificates?",
       "options": [
        "Invalid certificates make the firewall's CPU usage spike during decryption",
        "Users can no longer see the real certificate, so they rely on the firewall to check it",
        "IPS signatures cannot run on any session whose server presents an invalid or expired certificate",
        "Invalid certificates always indicate malware command-and-control infrastructure"
       ],
       "answer": 1,
       "explain": "The firewall takes over validation from the browser. Hiding errors would remove protection from man-in-the-middle attacks."
      },
      {
       "q": "A mobile app fails only when outbound inspection is enabled. What is the most likely reason?",
       "options": [
        "The app uses certificate pinning and rejects the substitute certificate",
        "The app negotiates TLS 1.2 rather than TLS 1.3 with its backend servers",
        "The app's traffic is being NATed to a public address",
        "The app requires IPv6 to function"
       ],
       "answer": 0,
       "explain": "Pinned apps accept only expected certificates or keys, so interception breaks them. TLS version, NAT and IPv6 do not explain this."
      },
      {
       "q": "Where should IPS profiles be attached?",
       "options": [
        "To deny rules, so that blocked traffic is also inspected for known exploit attempts",
        "Only to the default-deny rule at the bottom",
        "To allow rules, with profiles tuned by risk",
        "Only to management-plane traffic"
       ],
       "answer": 2,
       "explain": "IPS inspects permitted traffic; blocked traffic is already stopped. Risk-based profile selection balances protection and performance."
      },
      {
       "q": "What is the safest first step when introducing IPS on a busy network?",
       "options": [
        "Enable every signature in block mode on all rules at once to maximise protection",
        "Run it alert-only first and review false positives",
        "Disable signature updates to keep behaviour stable",
        "Exclude encrypted traffic from the IPS permanently"
       ],
       "answer": 1,
       "explain": "Alert-only baselining avoids outages. Blocking everything at once, freezing updates or permanently excluding traffic all reduce safety or availability."
      }
     ]
    }
   ]
  },
  {
   "id": "m2-l4",
   "title": "Firewall High Availability Designs",
   "subtitle": "Keep security enforcement running through failures without creating split-brain or asymmetric traffic",
   "minutes": 25,
   "objectives": [
    "Compare active/standby and active/active firewall clustering",
    "Explain configuration and session synchronisation",
    "Design failover triggers using interface and path monitoring",
    "Avoid asymmetric routing and split-brain failures"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "A firewall is a single point of enforcement — which can also make it a single point of failure. **High availability (HA)** pairs or clusters firewalls so that a hardware, link or software failure does not stop the business. The challenge is that firewalls are stateful: a failover that loses the session table drops every active connection."
    },
    {
     "type": "compare",
     "title": "HA models",
     "columns": [
      {
       "title": "Active/standby",
       "items": [
        "One unit forwards; the peer is ready",
        "Simplest to operate and troubleshoot",
        "Half the hardware idles",
        "Most common for perimeter and VPN"
       ]
      },
      {
       "title": "Active/active",
       "items": [
        "Both units forward traffic",
        "Better use of capacity",
        "Risk of asymmetric flows and complex NAT",
        "Each unit must handle full load if the other fails"
       ]
      },
      {
       "title": "Cluster (3+ units)",
       "items": [
        "Traffic spread across members",
        "Scales throughput",
        "Needs a cluster control link and careful load distribution",
        "Common in large data centres"
       ]
      }
     ]
    },
    {
     "type": "layers",
     "title": "What an HA pair synchronises",
     "items": [
      {
       "label": "Control link",
       "parts": [
        "Heartbeats",
        "Role election",
        "Priority and preemption"
       ]
      },
      {
       "label": "Configuration sync",
       "parts": [
        "Rules and objects",
        "NAT",
        "Certificates and keys"
       ]
      },
      {
       "label": "State sync",
       "parts": [
        "Session table",
        "NAT translations",
        "IPsec SAs (platform dependent)"
       ]
      },
      {
       "label": "Data plane",
       "parts": [
        "Shared virtual IP / MAC",
        "Gratuitous ARP on failover",
        "Routing adjacency handover"
       ]
      }
     ]
    },
    {
     "type": "topology",
     "title": "Active/standby pair with diverse heartbeats",
     "caption": "The pair shares virtual addresses toward the ISP and the core, so a failover only moves ownership. Control and sync links run directly between the units, and a backup heartbeat over the management network prevents split-brain if both direct links fail.",
     "nodes": [
      {
       "id": "isp",
       "kind": "router",
       "label": "ISP router",
       "sub": "203.0.113.1, path monitor",
       "x": 3,
       "y": 0
      },
      {
       "id": "fw1",
       "kind": "firewall",
       "label": "FW1 (active)",
       "sub": "priority 100",
       "x": 1,
       "y": 2
      },
      {
       "id": "fw2",
       "kind": "firewall",
       "label": "FW2 (standby)",
       "sub": "priority 90",
       "x": 5,
       "y": 2
      },
      {
       "id": "msw",
       "kind": "switch",
       "label": "Mgmt switch",
       "sub": "backup heartbeat",
       "x": 3,
       "y": 3
      },
      {
       "id": "core",
       "kind": "l3switch",
       "label": "Core switch",
       "sub": "gateway = firewall VIP",
       "x": 3,
       "y": 5
      }
     ],
     "links": [
      {
       "a": "isp",
       "b": "fw1",
       "bEnd": "eth1/1"
      },
      {
       "a": "isp",
       "b": "fw2",
       "bEnd": "eth1/1"
      },
      {
       "a": "fw1",
       "b": "fw2",
       "label": "ha1 control + ha2 sync",
       "style": "bold",
       "aEnd": "ha1/ha2",
       "bEnd": "ha1/ha2"
      },
      {
       "a": "fw1",
       "b": "msw",
       "style": "dashed"
      },
      {
       "a": "fw2",
       "b": "msw",
       "style": "dashed"
      },
      {
       "a": "fw1",
       "b": "core",
       "aEnd": "eth1/2"
      },
      {
       "a": "fw2",
       "b": "core",
       "aEnd": "eth1/2"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Active/standby HA with link and path monitoring",
     "device": "FW1 · generic NGFW CLI",
     "lines": [
      "# Illustrative syntax — map to your platform",
      "set ha mode active-passive",
      "set ha group 10 peer-ip 169.254.10.2",
      "set ha priority 100",
      "set ha preempt disable",
      "set ha control-link interface ha1 encryption enable",
      "set ha state-sync interface ha2",
      "set ha monitor link-group UPLINKS interfaces ethernet1/1 ethernet1/2 failure-condition all",
      "set ha monitor path-group ISP destination 203.0.113.1 interval 1000 threshold 3"
     ],
     "note": "Preemption is disabled so the pair does not fail back automatically and cause a second disruption after a flapping recovery."
    },
    {
     "type": "framework",
     "title": "Failover trigger design",
     "items": [
      {
       "label": "H1",
       "title": "Heartbeat loss",
       "text": "Peer unreachable on all control links; use two diverse links to avoid split-brain."
      },
      {
       "label": "H2",
       "title": "Link monitoring",
       "text": "Fail over when critical interfaces go down; group links with any/all conditions."
      },
      {
       "label": "H3",
       "title": "Path monitoring",
       "text": "Ping next hops or upstream targets to catch failures beyond the local link."
      },
      {
       "label": "H4",
       "title": "Health of processes",
       "text": "Fail over on data-plane or critical daemon failure."
      },
      {
       "label": "H5",
       "title": "Preemption policy",
       "text": "Decide deliberately whether the preferred unit reclaims the active role."
      }
     ]
    },
    {
     "type": "sequence",
     "title": "What happens during a failover",
     "caption": "Because sessions were synchronised before the failure, FW2 can forward packets of flows it never saw start. The gratuitous ARP only moves the shared address to a new switch port; clients notice nothing.",
     "actors": [
      "FW1 (active)",
      "FW2 (standby)",
      "Core switch"
     ],
     "steps": [
      {
       "from": 0,
       "to": 1,
       "label": "Heartbeats + session sync",
       "note": "ha1, ha2 and backup path"
      },
      {
       "from": 0,
       "to": 0,
       "label": "FW1 loses power"
      },
      {
       "from": 1,
       "to": 1,
       "label": "Heartbeats missed: peer down",
       "note": "after the configured threshold"
      },
      {
       "from": 1,
       "to": 1,
       "label": "Take active role, own the VIPs"
      },
      {
       "from": 1,
       "to": 2,
       "label": "Gratuitous ARP for each VIP",
       "note": "switch relearns where the VIP lives"
      },
      {
       "from": 2,
       "to": 1,
       "label": "Existing flows now reach FW2",
       "note": "synced sessions continue",
       "reply": true
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "If both control links fail but both units are healthy, each may think the other is dead and become active, with the same IP and MAC addresses — causing duplicate addresses and dropped sessions. Use at least two physically separate HA links (or a backup heartbeat over a data or management interface) and test the scenario.",
     "title": "Split-brain"
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "If a SYN leaves through firewall A and the SYN-ACK returns through firewall B, B has no session and drops the reply. In active/active designs, keep flows symmetric with routing design, session-owner forwarding between members or an external load balancer that hashes consistently.",
     "title": "Asymmetric routing breaks state"
    },
    {
     "type": "scenario",
     "title": "Failover drops all VPN users",
     "situation": "During a planned failover test, web sessions survive but all remote-access VPN users must reconnect. The pair is configured with state sync.",
     "options": [
      {
       "text": "Check whether the platform synchronises VPN SAs and whether that option is enabled; if not, plan maintenance windows accordingly",
       "feedback": "Correct. Many platforms sync firewall sessions but VPN or remote-access state separately or not at all; verify and document behaviour.",
       "best": true
      },
      {
       "text": "Increase the heartbeat interval to slow failover",
       "feedback": "Slower failover does not preserve VPN state; it just lengthens the outage on real failures.",
       "best": false
      },
      {
       "text": "Enable preemption so the original unit returns quickly",
       "feedback": "Failing back causes a second disruption and does not address state.",
       "best": false
      }
     ]
    },
    {
     "type": "table",
     "title": "HA test plan essentials",
     "head": [
      "Test",
      "Expected result",
      "Evidence"
     ],
     "rows": [
      [
       "Power off the active unit",
       "Standby takes over within the target time; sessions persist",
       "Continuous ping and long-lived TCP session survive"
      ],
      [
       "Unplug a monitored uplink",
       "Failover triggered by link group",
       "HA log shows reason 'link monitor'"
      ],
      [
       "Break the upstream path only",
       "Failover triggered by path monitor",
       "Traffic resumes via peer's uplink"
      ],
      [
       "Cut one HA link",
       "No failover; alarm raised",
       "Both units remain in correct roles"
      ],
      [
       "Software upgrade of standby, then failover",
       "Upgrade without business outage",
       "Change record with timings"
      ]
     ]
    },
    {
     "type": "reflection",
     "prompt": "When did your organisation last perform a real failover test of its perimeter firewalls? List the three failure scenarios you would test first and how you would prove sessions survived."
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "Stateful HA must synchronise sessions as well as configuration, or failover drops every connection.",
      "Active/standby is simplest; active/active and clusters add capacity but demand symmetric flows.",
      "Use link and path monitoring, diverse heartbeats and a deliberate preemption choice.",
      "Prove HA with planned tests (power, link, path, HA-link and upgrade) and keep the evidence."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Why is session synchronisation important in a stateful HA pair?",
       "options": [
        "Without it, the configuration on the two units drifts apart and policies stop matching after changes",
        "Without it, the heartbeat link cannot elect which unit should become active",
        "Without it, NAT rules cannot be configured on the standby unit of the pair",
        "Without it, a failover drops every established session"
       ],
       "answer": 3,
       "explain": "State sync preserves sessions; configuration sync and heartbeats are separate functions."
      },
      {
       "q": "Both HA control links fail but both firewalls are healthy. What risk does this create?",
       "options": [
        "A routing loop forming between the two firewalls' data-plane interfaces",
        "Split-brain: both units go active at once",
        "Automatic deletion of the session table on both units",
        "Loss of all configuration until manual resynchronisation"
       ],
       "answer": 1,
       "explain": "Each unit assumes the peer is dead and takes the active role. Diverse HA links or backup heartbeats prevent it."
      },
      {
       "q": "Why might preemption be disabled in a firewall pair?",
       "options": [
        "Because preemption prevents configuration synchronisation between the units",
        "Because preemption is required for active/active only",
        "Because preemption disables path monitoring",
        "Because failback would cause a second outage when the unit returns"
       ],
       "answer": 3,
       "explain": "Preemption causes failback; if the recovered unit is unstable this creates repeated outages. It is unrelated to config sync or monitoring."
      },
      {
       "q": "In an active/active pair, return traffic arrives at the unit that did not see the SYN and is dropped. What is the root cause?",
       "options": [
        "Asymmetric routing across the two units",
        "The IPS profile on the return-traffic rule is still set to alert-only mode",
        "The standby unit has an older signature database",
        "Path monitoring is configured with too short an interval"
       ],
       "answer": 0,
       "explain": "Stateful devices drop packets with no matching session; symmetric routing or owner forwarding is needed."
      },
      {
       "q": "Which HA test proves that path monitoring works?",
       "options": [
        "Power off the active firewall completely and time the failover",
        "Disconnect one of the HA control links and watch the role election",
        "Break connectivity beyond the local uplink while the local interface stays up",
        "Upgrade the standby unit's software and then fail over to it deliberately"
       ],
       "answer": 2,
       "explain": "Path monitoring detects failures beyond the link. Powering off tests heartbeat failover; cutting one HA link tests resilience of control links."
      }
     ]
    }
   ]
  },
  {
   "id": "m2-l5",
   "title": "Policy Hygiene, Audit and Troubleshooting",
   "subtitle": "Keep the rule base lean and provable, and find the real cause of a blocked flow quickly",
   "minutes": 30,
   "objectives": [
    "Identify shadowed, redundant, overly broad and unused rules",
    "Run a firewall rule recertification and audit process",
    "Troubleshoot blocked or broken flows using logs, packet traces and captures",
    "Interpret TCP behaviour in captures to locate the failing device"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Firewall rule bases decay. Projects end but their rules remain; emergency changes are never reverted; names drift from reality. A large, messy rule base is slower to audit, easier to bypass and harder to troubleshoot. **Policy hygiene** is ongoing engineering work, not an annual clean-up."
    },
    {
     "type": "table",
     "title": "Common rule-base problems",
     "head": [
      "Problem",
      "What it looks like",
      "Fix"
     ],
     "rows": [
      [
       "Shadowed rule",
       "A specific rule sits below a broader rule that already matches its traffic, so it never hits",
       "Reorder or remove; verify intent with the owner"
      ],
      [
       "Redundant rule",
       "Two rules permit the same traffic",
       "Merge into one with clear ownership"
      ],
      [
       "Overly permissive rule",
       "'Any' in source, destination and service; or whole subnets to whole subnets",
       "Narrow using flow logs and application identification"
      ],
      [
       "Unused rule",
       "Zero hits for 90+ days",
       "Disable, monitor, then delete after a grace period"
      ],
      [
       "Orphaned objects",
       "Address objects for decommissioned servers",
       "Remove; they hide in groups and widen rules"
      ],
      [
       "Missing logging",
       "Allow rules without session-end logs",
       "Enable logging on all allow and deny rules"
      ]
     ]
    },
    {
     "type": "template",
     "title": "Firewall rule review sheet",
     "purpose": "Use during quarterly recertification; every rule must be confirmed by its owner or removed.",
     "columns": [
      "Rule ID / name",
      "Source → Destination",
      "Application / service",
      "Hit count (90 days)",
      "Owner and justification",
      "Finding",
      "Decision"
     ],
     "example": [
      [
       "DMZ-WEB-IN-07",
       "Vendor ranges → web01",
       "HTTPS",
       "18,432",
       "App team; ticket CHG-2214 vendor API",
       "Correct scope",
       "Keep, review in 6 months"
      ],
      [
       "TEMP-ANY-DB",
       "10.0.0.0/8 → db-cluster",
       "any",
       "0",
       "Unknown; created during 2024 migration",
       "Overly broad and unused",
       "Disable now, delete in 30 days"
      ]
     ],
     "rows": 8
    },
    {
     "type": "steps",
     "title": "Quarterly recertification process",
     "items": [
      {
       "title": "Export and analyse",
       "text": "Pull rules with hit counts and last-hit dates; run automated shadow/redundancy analysis."
      },
      {
       "title": "Send to owners",
       "text": "Each owner confirms, narrows or retires their rules by a deadline."
      },
      {
       "title": "Unowned rules",
       "text": "No owner response means disable (not delete) with monitoring for impact."
      },
      {
       "title": "Change control",
       "text": "Apply changes through normal approval with rollback ready."
      },
      {
       "title": "Report",
       "text": "Track metrics: total rules, rules with 'any', unused rules, average age."
      }
     ]
    },
    {
     "type": "text",
     "text": "When a user says 'the firewall is blocking me', start from evidence. A methodical approach separates **policy** problems (a rule denies it) from **path** problems (routing, NAT, asymmetric return) and **endpoint** problems (the server is not listening)."
    },
    {
     "type": "flow",
     "title": "Troubleshooting a blocked flow",
     "items": [
      {
       "label": "Define the flow",
       "text": "Exact source, destination, port, application and time"
      },
      {
       "label": "Check the logs",
       "text": "Is there a deny log, an allow log or nothing at all?"
      },
      {
       "label": "Simulate",
       "text": "Use the platform's packet-trace or policy-lookup tool"
      },
      {
       "label": "Capture",
       "text": "Capture on ingress and egress interfaces"
      },
      {
       "label": "Fix and verify",
       "text": "Change the right element; confirm with logs and the user"
      }
     ]
    },
    {
     "type": "tree",
     "title": "What the firewall logs tell you first",
     "root": {
      "label": "User reports a blocked flow",
      "text": "Define source, destination, port and time",
      "children": [
       {
        "label": "No log at all",
        "text": "Packets never reached policy: check routing, VLAN, capture ingress"
       },
       {
        "label": "Deny log",
        "text": "Name the rule; change policy through change control with the owner"
       },
       {
        "label": "Allow log",
        "text": "Policy is fine; look at the path and the server",
        "children": [
         {
          "label": "No SYN-ACK",
          "text": "Server down or return path bypasses the firewall"
         },
         {
          "label": "RST from server",
          "text": "Port closed or host firewall rejects"
         },
         {
          "label": "TLS alert",
          "text": "Certificate, cipher or inspection policy"
         },
         {
          "label": "Large packets stall",
          "text": "MTU or fragmentation, often over tunnels"
         }
        ]
       }
      ]
     },
     "caption": "The type of log narrows the search before you touch any rule: no log points upstream, a deny log points at policy, and an allow log means the cause is beyond the rule base."
    },
    {
     "type": "cli",
     "title": "Capturing on the server-side interface",
     "device": "Linux sensor · tcpdump",
     "lines": [
      "# tcpdump -ni eth1 host 10.20.0.15 and tcp port 8443",
      "10:41:02.113 IP 10.10.4.21.53188 > 10.20.0.15.8443: Flags [S], seq 2918822,  win 64240",
      "10:41:02.114 IP 10.20.0.15.8443 > 10.10.4.21.53188: Flags [R.], seq 0, ack 2918823, win 0",
      "10:41:03.120 IP 10.10.4.21.53188 > 10.20.0.15.8443: Flags [S], seq 2918822,  win 64240",
      "10:41:03.121 IP 10.20.0.15.8443 > 10.10.4.21.53188: Flags [R.], seq 0, ack 2918823, win 0"
     ],
     "note": "The SYN reaches the server and the server itself answers with RST: nothing is listening on 8443 (or a host firewall rejects). The network firewall is not the problem."
    },
    {
     "type": "table",
     "title": "Reading captures quickly",
     "head": [
      "What you see",
      "Likely meaning"
     ],
     "rows": [
      [
       "SYN on ingress, nothing on egress",
       "Firewall dropped it (check deny logs and policy) or routing sends it elsewhere"
      ],
      [
       "SYN on egress, no SYN-ACK back",
       "Server down, path beyond firewall broken, or return traffic routed around the firewall"
      ],
      [
       "SYN-ACK returns on a different interface or firewall",
       "Asymmetric routing; stateful device will drop it"
      ],
      [
       "RST from the server",
       "Port closed or host firewall rejecting"
      ],
      [
       "Handshake completes, then TLS alert",
       "Certificate or cipher problem; check inspection policy"
      ],
      [
       "Large packets retransmitted, small ones fine",
       "MTU / fragmentation issue, often over tunnels"
      ]
     ]
    },
    {
     "type": "scenario",
     "title": "No logs at all",
     "situation": "A user cannot reach an internal app at 10.30.5.9:443. The firewall shows no deny log and no allow log for that flow, although logging is enabled on all rules including default deny.",
     "options": [
      {
       "text": "Add an allow rule for the user to the app",
       "feedback": "There is no evidence the firewall is denying; adding rules without evidence widens policy.",
       "best": false
      },
      {
       "text": "Restart the firewall to clear the session table",
       "feedback": "Disruptive and unsupported by evidence.",
       "best": false
      },
      {
       "text": "Confirm the traffic actually reaches the firewall — check routing on the user's path and capture on the ingress interface",
       "feedback": "Correct. No log of any kind usually means the packets never arrived; the problem is upstream routing, VLAN or the client.",
       "best": true
      },
      {
       "text": "Disable the IPS profile on the rule",
       "feedback": "IPS drops would produce threat logs; with no logs at all the flow never reached policy.",
       "best": false
      }
     ]
    },
    {
     "type": "case",
     "title": "Retail chain firewall audit",
     "context": "A retail chain with 220 stores has one central firewall cluster with 4,800 rules. An external audit finds 1,150 rules with zero hits in a year, 310 rules with 'any' as the service, 60 rules referencing servers that no longer exist, and no documented owners. Card-payment systems share a zone with back-office servers. The security team has two engineers and a quarter to show progress.",
     "questions": [
      "How would you prioritise the clean-up?",
      "What should happen to unused rules, and how do you avoid outages?",
      "What architectural change does the audit point to?",
      "Which metrics would show progress to the board?"
     ],
     "answer": "**Prioritise by risk:** first, rules touching the payment zone and any 'any-service' rules from untrusted zones; second, rules referencing non-existent servers (their addresses may be reused by new hosts); third, unused rules in bulk. **Unused rules:** disable in batches with logging and a 30-day observation window, then delete; communicate the schedule to application teams. **Architecture:** move card-payment systems into their own zone (reducing compliance scope) with tightly scoped inbound and outbound rules; consider per-store templates managed centrally. **Governance:** introduce rule owners, expiry dates on new rules and quarterly recertification. **Metrics:** total rules, percentage with owners, number of 'any-service' rules, unused rules remaining, and mean time to approve a rule request."
    },
    {
     "type": "checklist",
     "title": "Rule-base health checklist",
     "items": [
      "Every rule has an owner, justification and ticket reference",
      "No allow rule has 'any' in source, destination and service together",
      "Rules unused for 90 days are reviewed and disabled",
      "Shadow and redundancy analysis runs at least quarterly",
      "Address objects for decommissioned systems are removed",
      "All allow and deny rules log to the SIEM",
      "Temporary rules carry an expiry date",
      "Default-deny rule at the end of every zone pair logs drops"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Stateful inspection",
       "def": "Tracking connection state so return traffic is allowed only when it matches an existing session."
      },
      {
       "term": "Security zone",
       "def": "A group of interfaces sharing a trust level; policy is written between zones."
      },
      {
       "term": "PAT",
       "def": "Port address translation: many inside hosts share one public address using unique source ports."
      },
      {
       "term": "NAT exemption",
       "def": "A rule that prevents translation for selected traffic, typically between VPN-connected private networks."
      },
      {
       "term": "Application identification",
       "def": "Classifying traffic by application using decoders, signatures and handshake data rather than port numbers."
      },
      {
       "term": "TLS inspection",
       "def": "Decrypting, inspecting and re-encrypting TLS traffic at a firewall or proxy under a defined policy."
      },
      {
       "term": "Certificate pinning",
       "def": "An application accepting only specific certificates or keys, which causes interception to fail."
      },
      {
       "term": "Encrypted Client Hello",
       "def": "A TLS extension that encrypts the server name and other handshake details from observers."
      },
      {
       "term": "Split-brain",
       "def": "An HA failure in which both units believe they are active at the same time."
      },
      {
       "term": "Shadowed rule",
       "def": "A rule that never matches because an earlier, broader rule already handles its traffic."
      },
      {
       "term": "Asymmetric routing",
       "def": "Forward and return packets of one flow taking different paths, breaking stateful inspection."
      }
     ]
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "Rule bases decay; find shadowed, redundant, broad, unused and orphaned rules continuously.",
      "Recertify quarterly with owners; disable unowned or unused rules with monitoring before deleting them.",
      "Troubleshoot from evidence: logs first, then packet-trace tools, then captures on ingress and egress.",
      "Read the TCP story in a capture to tell policy, path and endpoint problems apart."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A rule permitting HTTPS to server A never shows hits, although users reach server A over HTTPS daily. What is most likely?",
       "options": [
        "Server A does not support TLS 1.3, so connections are classified differently",
        "Logging is disabled on the default-deny rule",
        "It is shadowed by an earlier, broader rule that already matches the same traffic",
        "The rule uses an application object instead of a port"
       ],
       "answer": 2,
       "explain": "Traffic works but this rule is never hit, so an earlier rule must be matching first. The other options do not explain zero hits with working traffic."
      },
      {
       "q": "What should happen to a rule with no owner response during recertification?",
       "options": [
        "Disable it with monitoring, then delete it after a grace period if nothing breaks",
        "Delete it immediately to reduce the rule count before the next audit cycle",
        "Keep it permanently, because removing any rule might break an unknown dependency",
        "Convert it to 'any' service so it is easier to manage"
       ],
       "answer": 0,
       "explain": "Disable-then-delete balances risk and availability. Immediate deletion risks outages; keeping it forever preserves risk."
      },
      {
       "q": "A capture shows the SYN leaving the firewall's server-side interface and no reply. What is the best next check?",
       "options": [
        "Whether the firewall policy allows the SYN outbound on the server-side interface and zone",
        "Whether the client's browser trusts the TLS inspection CA certificate",
        "Whether the IPS signatures on the server-facing rule are fully up to date",
        "Whether the server is up and its replies return through the same firewall"
       ],
       "answer": 3,
       "explain": "The SYN already passed policy. No reply points to the server or an asymmetric return path. CA trust and IPS are not involved yet."
      },
      {
       "q": "Large file transfers over a tunnel stall while small requests work. What does this pattern suggest?",
       "options": [
        "A shadowed rule for the file-transfer application",
        "An MTU or fragmentation problem along the path",
        "Missing user-to-IP mapping for the sender",
        "An expired IPS licence on the firewall"
       ],
       "answer": 1,
       "explain": "Size-dependent failure is the classic sign of MTU problems, especially with tunnel overhead. Policy and identity issues affect all sizes."
      },
      {
       "q": "Why are address objects for decommissioned servers a security risk?",
       "options": [
        "Their addresses may be reassigned to new hosts that inherit old permissions",
        "They consume licences on most firewall platforms and raise support costs",
        "They prevent configuration synchronisation between units of an HA pair",
        "They cause the firewall to drop all traffic sent to that subnet until removed"
       ],
       "answer": 0,
       "explain": "Reused IPs inherit stale access. Licensing, HA sync and blanket drops are not the concern."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m3",
 "order": 3,
 "code": "Tunnel",
 "title": "VPN Technologies",
 "subtitle": "Build, scale and troubleshoot IPsec and remote-access VPNs with strong cryptography and dependable PKI",
 "outcomes": [
  "Explain IKEv2 exchanges, security associations, transforms and perfect forward secrecy",
  "Configure route-based and policy-based IKEv2 site-to-site VPNs correctly",
  "Design dynamic hub-and-spoke overlays and secure remote-access VPNs",
  "Run a PKI for VPN authentication with reliable revocation checking",
  "Troubleshoot VPN negotiation systematically from underlay to data plane"
 ],
 "lessons": [
  {
   "id": "m3-l1",
   "title": "IPsec and IKEv2 Fundamentals",
   "subtitle": "Security associations, the IKEv2 exchanges, transforms and perfect forward secrecy",
   "minutes": 30,
   "objectives": [
    "Describe the IKEv2 exchanges defined in RFC 7296 and what each establishes",
    "Distinguish the IKE SA from Child SAs and explain SPIs",
    "Choose strong, interoperable transforms and DH groups for 2026",
    "Explain perfect forward secrecy and when it is applied"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "**IPsec** protects IP packets with confidentiality, integrity and authentication of the peer. On its own, IPsec needs keys and parameters; **IKEv2** (Internet Key Exchange version 2, RFC 7296) is the protocol that authenticates the peers, negotiates those parameters and creates the keys. Almost every modern site-to-site and many remote-access VPNs use IKEv2 with ESP."
    },
    {
     "type": "table",
     "title": "IPsec building blocks",
     "head": [
      "Element",
      "What it is",
      "Key facts"
     ],
     "rows": [
      [
       "ESP",
       "Encapsulating Security Payload, IP protocol 50",
       "Provides encryption and integrity; the default choice"
      ],
      [
       "AH",
       "Authentication Header, IP protocol 51",
       "Integrity only, covers parts of the outer IP header, so it breaks through NAT; rarely used"
      ],
      [
       "Tunnel mode",
       "Whole original packet encrypted inside a new IP header",
       "Used for gateway-to-gateway VPNs"
      ],
      [
       "Transport mode",
       "Only the payload is protected; original header kept",
       "Host-to-host, or GRE-over-IPsec where GRE supplies the outer header"
      ],
      [
       "NAT traversal",
       "ESP wrapped in UDP 4500",
       "Triggered when IKEv2 detects NAT between peers"
      ],
      [
       "IKE ports",
       "UDP 500, moving to UDP 4500 when NAT is detected",
       "Both must be allowed through upstream firewalls"
      ]
     ]
    },
    {
     "type": "packet",
     "title": "ESP packet with AES-GCM (RFC 4303, RFC 4106)",
     "width": 32,
     "fields": [
      {
       "label": "Security Parameters Index (SPI)",
       "bits": 32
      },
      {
       "label": "Sequence number",
       "bits": 32
      },
      {
       "label": "IV (8 bytes with AES-GCM)",
       "bits": 32,
       "variable": true
      },
      {
       "label": "Payload data: inner IP packet",
       "bits": 32,
       "variable": true
      },
      {
       "label": "Padding (0–255 bytes)",
       "bits": 16,
       "variable": true
      },
      {
       "label": "Pad length",
       "bits": 8
      },
      {
       "label": "Next header",
       "bits": 8
      },
      {
       "label": "ICV (16 bytes with AES-GCM)",
       "bits": 32,
       "variable": true
      }
     ],
     "caption": "SPI and sequence number travel in clear so the receiver can find the SA and reject replays; everything from the payload to the next-header field is encrypted, and the ICV authenticates the ESP header and ciphertext. Fields marked variable depend on the algorithm or the packet and are drawn one row high."
    },
    {
     "type": "sequence",
     "title": "IKEv2 exchanges (RFC 7296)",
     "caption": "Four messages create the IKE SA and the first Child SA; braces mark encrypted payloads. CREATE_CHILD_SA and INFORMATIONAL exchanges happen later, for rekeys, extra SAs and liveness checks.",
     "actors": [
      "Initiator",
      "Responder"
     ],
     "steps": [
      {
       "from": 0,
       "to": 1,
       "label": "IKE_SA_INIT: SAi1 KEi Ni",
       "note": "+ NAT-detection notifies"
      },
      {
       "from": 1,
       "to": 0,
       "label": "IKE_SA_INIT: SAr1 KEr Nr",
       "note": "both sides derive IKE SA keys",
       "reply": true
      },
      {
       "from": 0,
       "to": 1,
       "label": "IKE_AUTH {IDi AUTH SAi2}",
       "note": "+ TSi, TSr; UDP 4500 if NAT seen"
      },
      {
       "from": 1,
       "to": 0,
       "label": "IKE_AUTH {IDr AUTH SAr2}",
       "note": "IKE SA + first Child SA are up",
       "reply": true
      },
      {
       "from": 0,
       "to": 1,
       "label": "CREATE_CHILD_SA request",
       "note": "later: SA, Ni, KEi (PFS), TS"
      },
      {
       "from": 1,
       "to": 0,
       "label": "CREATE_CHILD_SA response",
       "reply": true
      },
      {
       "from": 0,
       "to": 1,
       "label": "INFORMATIONAL (DPD)",
       "note": "liveness, delete, error notifies"
      },
      {
       "from": 1,
       "to": 0,
       "label": "INFORMATIONAL response",
       "reply": true
      }
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Engineers still say 'phase 1' for the IKE SA and 'phase 2' for the IPsec SAs. That mapping is useful, but IKEv2 is not split the same way: the first Child SA is created **inside** IKE_AUTH, so a working IKEv2 tunnel needs only four messages, compared with nine in IKEv1 main mode plus quick mode.",
     "title": "Phase 1 and phase 2 are IKEv1 words"
    },
    {
     "type": "compare",
     "title": "IKE SA versus Child SA",
     "columns": [
      {
       "title": "IKE SA",
       "items": [
        "One per peer pair (bidirectional)",
        "Protects IKEv2 control messages",
        "Created by IKE_SA_INIT and authenticated by IKE_AUTH",
        "Typical lifetime: hours (often 24h)"
       ]
      },
      {
       "title": "Child SA (IPsec SA)",
       "items": [
        "A pair of unidirectional SAs, one per direction",
        "Each direction has its own SPI",
        "Protects user traffic matching the traffic selectors",
        "Shorter lifetime (often 1h or a data volume)"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Transform choices for 2026",
     "head": [
      "Purpose",
      "Recommended",
      "Acceptable for legacy interop",
      "Avoid"
     ],
     "rows": [
      [
       "ESP encryption",
       "AES-GCM-256 (AEAD; no separate integrity)",
       "AES-CBC-256 with HMAC-SHA-256",
       "DES, 3DES, NULL encryption"
      ],
      [
       "ESP integrity (non-AEAD)",
       "HMAC-SHA-256/384/512",
       "—",
       "MD5, SHA-1"
      ],
      [
       "IKE PRF",
       "PRF-HMAC-SHA-384 or SHA-256",
       "—",
       "PRF-HMAC-MD5, SHA-1"
      ],
      [
       "Diffie-Hellman group",
       "19 or 20 (ECP 256/384), 31 (Curve25519)",
       "14 (MODP 2048) minimum",
       "1, 2, 5"
      ],
      [
       "Post-quantum key exchange",
       "Hybrid: classical group plus ML-KEM as an additional key exchange (RFC 9370) where both peers support it",
       "Classical group 19/20/31 while you plan the migration",
       "Long-lived tunnels with no migration plan"
      ],
      [
       "Peer authentication",
       "Certificates (ECDSA or RSA ≥ 3072)",
       "Long random PSK stored in a vault",
       "Short, shared or reused PSKs"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "NIST published its first post-quantum standards in August 2024: **FIPS 203 (ML-KEM)** for key establishment and **FIPS 204 (ML-DSA)** and **FIPS 205 (SLH-DSA)** for signatures. For IKEv2, RFC 9370 allows **multiple key exchanges**: a classical DH group is combined with a post-quantum KEM such as ML-KEM, carried in IKE_INTERMEDIATE exchanges (RFC 9242) between IKE_SA_INIT and IKE_AUTH, so the result is safe as long as either algorithm holds. Platform support is still arriving. Start now with a **crypto inventory** (which tunnels carry long-lived sensitive data, which algorithms and certificates they use) and design for **crypto agility**, because recorded traffic could be decrypted later ('harvest now, decrypt later'). Government transition deadlines for retiring RSA and elliptic-curve algorithms are being set for the early-to-mid 2030s; check the current official timetable for your sector.",
     "title": "Post-quantum planning"
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "With **PFS**, each new Child SA key is derived from a fresh Diffie-Hellman exchange, so compromising one key (or the long-term authentication secret) does not expose traffic protected by other keys. In IKEv2 the first Child SA reuses keying material from IKE_SA_INIT; the configured PFS group is applied when Child SAs are **rekeyed** with CREATE_CHILD_SA.",
     "title": "Perfect forward secrecy (PFS)"
    },
    {
     "type": "scenario",
     "title": "Tunnel drops every hour",
     "situation": "A new IKEv2 tunnel between two sites comes up instantly and passes traffic, but exactly 60 minutes later it fails and re-establishes after a minute. Logs at the drop show a failed CREATE_CHILD_SA exchange.",
     "options": [
      {
       "text": "Increase the IKE SA lifetime from 24 hours to 48 hours",
       "feedback": "The failure aligns with the Child SA rekey, not the IKE SA lifetime.",
       "best": false
      },
      {
       "text": "Check that both peers configure the same PFS group for the Child SA; a mismatch only appears at the first rekey",
       "feedback": "Correct. The initial Child SA is built in IKE_AUTH without a separate DH exchange, so PFS mismatches surface at rekey time, here the 1-hour lifetime.",
       "best": true
      },
      {
       "text": "Change the pre-shared key on both peers",
       "feedback": "Authentication succeeded at setup; the PSK is not the issue.",
       "best": false
      },
      {
       "text": "Switch from tunnel mode to transport mode",
       "feedback": "Mode is not related to a rekey failure and would break the site-to-site design.",
       "best": false
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "List the transforms currently used on your organisation's VPNs. Which tunnels still use groups or algorithms from the 'avoid' column, and what blocks their upgrade?"
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "IKEv2 needs four messages to build the IKE SA and the first Child SA; later exchanges rekey and check liveness.",
      "Use ESP with AEAD (AES-GCM), strong DH groups and certificates; retire DES, 3DES, MD5, SHA-1 and groups 1, 2 and 5.",
      "A Child SA is a pair of one-way SAs, each with its own SPI; PFS applies at Child SA rekeys.",
      "Plan post-quantum migration now: inventory tunnels and algorithms, and adopt hybrid ML-KEM key exchange as platforms support it."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "How many messages does IKEv2 need to establish the IKE SA and the first Child SA?",
       "options": [
        "Six messages of main mode followed by three of quick mode",
        "Two messages, because IKEv2 combines all negotiation into one exchange",
        "Four: two IKE_SA_INIT and two IKE_AUTH messages",
        "Eight messages, including two separate CREATE_CHILD_SA exchanges"
       ],
       "answer": 2,
       "explain": "IKEv2 uses IKE_SA_INIT and IKE_AUTH (four messages) and builds the first Child SA inside IKE_AUTH. Six plus three describes IKEv1."
      },
      {
       "q": "Why is AH rarely used in modern VPNs?",
       "options": [
        "It is limited to IPv6 traffic and cannot carry IPv4 packets in tunnel mode",
        "It offers no encryption, and its integrity check breaks whenever NAT alters the outer header",
        "It requires certificates and cannot be used with pre-shared key authentication",
        "It runs over TCP and therefore suffers from head-of-line blocking on lossy WAN links"
       ],
       "answer": 1,
       "explain": "AH protects parts of the outer IP header and offers no confidentiality, so NAT breaks it. It works with IPv4 and any IKE authentication method, and it is not TCP."
      },
      {
       "q": "What identifies each direction of a Child SA?",
       "options": [
        "The remaining lifetime counter of the parent IKE SA",
        "The Diffie-Hellman group number agreed during IKE_SA_INIT",
        "The serial number of the peer's certificate used in IKE_AUTH for that tunnel",
        "A separate SPI for each unidirectional SA"
       ],
       "answer": 3,
       "explain": "Child SAs are pairs of unidirectional SAs, each with its own SPI. The other values are unrelated to identifying the SA."
      },
      {
       "q": "Which ESP transform needs NO separate integrity algorithm?",
       "options": [
        "AES-CBC, because cipher block chaining includes a built-in checksum",
        "AES-GCM, an authenticated encryption mode",
        "3DES, because it encrypts three times",
        "NULL encryption, because it relies on IKE integrity"
       ],
       "answer": 1,
       "explain": "AEAD modes such as AES-GCM provide confidentiality and integrity together. CBC and 3DES need HMAC; NULL provides no confidentiality."
      },
      {
       "q": "When does the configured PFS group take effect in IKEv2?",
       "options": [
        "Only during IKE_SA_INIT, when the IKE SA keys are first derived",
        "Only for IKEv1 peers in aggressive mode",
        "Every time a dead peer detection liveness check is exchanged",
        "When Child SAs are rekeyed or created later"
       ],
       "answer": 3,
       "explain": "The first Child SA uses keys from the initial exchange; later Child SAs use a fresh DH exchange when PFS is configured."
      }
     ]
    }
   ]
  },
  {
   "id": "m3-l2",
   "title": "Site-to-Site VPN: Route-Based and Policy-Based",
   "subtitle": "Choose the right model and build a correct, maintainable IKEv2 site-to-site tunnel",
   "minutes": 32,
   "objectives": [
    "Compare route-based (VTI) and policy-based (crypto ACL) VPN designs",
    "Configure an IKEv2 site-to-site VPN with a virtual tunnel interface",
    "Run dynamic routing over tunnels and handle MTU correctly",
    "Verify a tunnel using SA state and packet counters"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "There are two ways to decide which traffic enters a tunnel. **Policy-based** VPNs use an access list (crypto ACL) that defines exactly which source and destination subnets are encrypted. **Route-based** VPNs create a tunnel interface; anything routed into that interface is encrypted. For anything beyond a simple pair of subnets, route-based designs are easier to operate."
    },
    {
     "type": "compare",
     "title": "Policy-based versus route-based",
     "columns": [
      {
       "title": "Policy-based (crypto ACL)",
       "items": [
        "Traffic selected by an ACL of subnet pairs",
        "Each subnet pair can create its own Child SA",
        "No routing protocol over the tunnel",
        "Adding a subnet means changing both peers' ACLs exactly",
        "Common with older or third-party peers"
       ]
      },
      {
       "title": "Route-based (VTI)",
       "items": [
        "Traffic selected by routing into a tunnel interface",
        "Selectors usually 0.0.0.0/0 to 0.0.0.0/0",
        "Supports dynamic routing (BGP, OSPF) and failover",
        "Interface counters, QoS and policy apply per tunnel",
        "Preferred for hub designs and cloud gateways"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "IKEv2 proposal, keyring and profile (branch side)",
     "device": "BR-R1 · IOS-style CLI",
     "lines": [
      "crypto ikev2 proposal PROP-GCM256",
      " encryption aes-gcm-256",
      " prf sha384",
      " group 20",
      "crypto ikev2 policy POL-GCM256",
      " proposal PROP-GCM256",
      "crypto ikev2 keyring KR-HQ",
      " peer HQ",
      "  address 203.0.113.1",
      "  pre-shared-key <long-random-key-from-vault>",
      "crypto ikev2 profile PROF-HQ",
      " match identity remote address 203.0.113.1 255.255.255.255",
      " authentication remote pre-share",
      " authentication local pre-share",
      " keyring local KR-HQ",
      " dpd 10 3 on-demand"
     ],
     "note": "With an AEAD cipher (AES-GCM) the IKEv2 proposal specifies a PRF but no separate integrity algorithm."
    },
    {
     "type": "cli",
     "title": "IPsec profile and virtual tunnel interface",
     "device": "BR-R1 · IOS-style CLI",
     "lines": [
      "crypto ipsec transform-set TS-GCM256 esp-gcm 256",
      " mode tunnel",
      "crypto ipsec profile IPSEC-HQ",
      " set transform-set TS-GCM256",
      " set pfs group20",
      " set ikev2-profile PROF-HQ",
      "interface Tunnel10",
      " ip address 172.16.10.2 255.255.255.252",
      " ip mtu 1400",
      " ip tcp adjust-mss 1360",
      " tunnel source GigabitEthernet0/1",
      " tunnel destination 203.0.113.1",
      " tunnel mode ipsec ipv4",
      " tunnel protection ipsec profile IPSEC-HQ"
     ],
     "note": "Lowering the tunnel MTU and clamping TCP MSS prevents fragmentation caused by ESP overhead."
    },
    {
     "type": "cli",
     "title": "Routing over the tunnel with BGP",
     "device": "BR-R1 · IOS-style CLI",
     "lines": [
      "router bgp 65010",
      " neighbor 172.16.10.1 remote-as 65000",
      " address-family ipv4",
      "  network 10.2.0.0 mask 255.255.0.0",
      "  neighbor 172.16.10.1 activate",
      "ip route 10.2.0.0 255.255.0.0 Null0 250"
     ],
     "note": "The floating Null0 route lets BGP advertise the branch aggregate. The hub learns the branch subnets dynamically, so adding a subnet needs no crypto change."
    },
    {
     "type": "topology",
     "title": "Route-based VPN with BGP over a VTI",
     "caption": "The tunnel is just another routed link (172.16.10.0/30) riding over the internet underlay between the two public addresses. BGP over it advertises 10.2.0.0/16 to HQ, so new subnets need routing changes only, not crypto changes.",
     "nodes": [
      {
       "id": "blan",
       "kind": "host",
       "label": "Branch LAN",
       "sub": "10.2.0.0/16",
       "x": 0,
       "y": 4
      },
      {
       "id": "br",
       "kind": "router",
       "label": "BR-R1",
       "sub": "AS 65010",
       "x": 1,
       "y": 2
      },
      {
       "id": "inet",
       "kind": "internet",
       "label": "Internet",
       "x": 3,
       "y": 0
      },
      {
       "id": "hq",
       "kind": "router",
       "label": "HQ-R1",
       "sub": "AS 65000",
       "x": 5,
       "y": 2
      },
      {
       "id": "hlan",
       "kind": "server",
       "label": "HQ services",
       "sub": "10.0.0.0/16",
       "x": 6,
       "y": 4
      }
     ],
     "links": [
      {
       "a": "br",
       "b": "inet",
       "aEnd": "198.51.100.2"
      },
      {
       "a": "inet",
       "b": "hq",
       "bEnd": "203.0.113.1"
      },
      {
       "a": "br",
       "b": "hq",
       "label": "Tunnel10 IPsec + eBGP",
       "style": "tunnel",
       "aEnd": "172.16.10.2",
       "bEnd": "172.16.10.1"
      },
      {
       "a": "blan",
       "b": "br"
      },
      {
       "a": "hq",
       "b": "hlan"
      }
     ],
     "zones": [
      {
       "label": "Branch",
       "x": 0,
       "y": 2,
       "w": 2,
       "h": 3,
       "tone": "neutral"
      },
      {
       "label": "Head office",
       "x": 5,
       "y": 2,
       "w": 2,
       "h": 3,
       "tone": "neutral"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Policy-based equivalent with a crypto map",
     "device": "BR-R2 · IOS-style CLI",
     "lines": [
      "ip access-list extended VPN-TO-PARTNER",
      " permit ip 10.3.0.0 0.0.255.255 192.168.50.0 0.0.0.255",
      "crypto map CMAP-PARTNER 10 ipsec-isakmp",
      " set peer 198.51.100.20",
      " set transform-set TS-GCM256",
      " set pfs group20",
      " set ikev2-profile PROF-PARTNER",
      " match address VPN-TO-PARTNER",
      "interface GigabitEthernet0/1",
      " crypto map CMAP-PARTNER"
     ],
     "note": "The partner must configure the mirror image of this ACL; mismatched selectors cause TS_UNACCEPTABLE errors. Exempt this traffic from NAT."
    },
    {
     "type": "cli",
     "title": "Verifying the tunnel",
     "device": "BR-R1 · IOS-style CLI",
     "lines": [
      "BR-R1# show crypto ikev2 sa",
      "Tunnel-id Local              Remote             fvrf/ivrf  Status",
      "1         198.51.100.2/500   203.0.113.1/500    none/none  READY",
      "      Encr: AES-GCM, keysize: 256, PRF: SHA384, Hash: None, DH Grp:20, Auth sign: PSK, Auth verify: PSK",
      "      Life/Active Time: 86400/1220 sec",
      "BR-R1# show crypto ipsec sa interface Tunnel10 | include pkts",
      "    #pkts encaps: 48210, #pkts encrypt: 48210, #pkts digest: 48210",
      "    #pkts decaps: 0, #pkts decrypt: 0, #pkts verify: 0"
     ],
     "note": "The IKE SA is READY and packets are being encrypted, but nothing is decrypted: the peer is not sending traffic back into the tunnel, or ESP is blocked on the return path."
    },
    {
     "type": "table",
     "title": "Reading the IPsec counters",
     "head": [
      "Encaps",
      "Decaps",
      "Most likely situation"
     ],
     "rows": [
      [
       "Increasing",
       "Increasing",
       "Tunnel healthy in both directions"
      ],
      [
       "Increasing",
       "Zero",
       "Peer has no route back into the tunnel, peer's selectors differ, or ESP/UDP 4500 is filtered on the return path"
      ],
      [
       "Zero",
       "Increasing",
       "Local routing does not send traffic into the tunnel, or a local NAT rule translates it first"
      ],
      [
       "Zero",
       "Zero",
       "No interesting traffic yet, or the Child SA never formed"
      ]
     ]
    },
    {
     "type": "template",
     "title": "VPN parameter sheet",
     "purpose": "Agree every value with the remote party before the change window; mismatches cause most first-time failures.",
     "columns": [
      "Parameter",
      "Local site",
      "Remote site",
      "Agreed value / notes"
     ],
     "example": [
      [
       "Peer public IP",
       "198.51.100.2",
       "203.0.113.1",
       "Static on both sides; NAT-T expected: no"
      ],
      [
       "IKE proposal",
       "AES-GCM-256 / PRF SHA-384 / group 20",
       "Same",
       "IKE SA lifetime 86,400 s; DPD 10 s"
      ],
      [
       "Child SA",
       "ESP AES-GCM-256, PFS group 20",
       "Same",
       "Lifetime 3,600 s; route-based, selectors 0.0.0.0/0"
      ]
     ],
     "rows": 8
    },
    {
     "type": "scenario",
     "title": "Adding a new subnet",
     "situation": "A partner connected by a policy-based VPN adds a new subnet, 192.168.60.0/24. Users in that subnet cannot reach your servers, while the original subnet still works. Your peer logs show TS_UNACCEPTABLE.",
     "options": [
      {
       "text": "Change the DH group on both peers",
       "feedback": "DH group mismatch produces different errors and would break the existing subnet too.",
       "best": false
      },
      {
       "text": "Restart the IKE SA to force renegotiation",
       "feedback": "Renegotiating with the same selectors will produce the same error.",
       "best": false
      },
      {
       "text": "Add the matching subnet pair to both crypto ACLs (mirrored) and to the NAT exemption, then retest",
       "feedback": "Correct. In a policy-based VPN the selectors must match on both sides; the new subnet is not covered.",
       "best": true
      },
      {
       "text": "Increase the tunnel MTU",
       "feedback": "MTU affects packet size, not which subnets are allowed into the tunnel.",
       "best": false
      }
     ]
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "Policy-based VPNs select traffic with mirrored crypto ACLs; route-based VPNs select it by routing into a tunnel interface.",
      "Prefer route-based VTIs with dynamic routing for anything beyond one subnet pair.",
      "Lower the tunnel MTU and clamp TCP MSS to absorb ESP overhead.",
      "Read encaps and decaps counters together to locate the failing direction."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "What is the main operational advantage of a route-based VPN?",
       "options": [
        "It lets routing pick what is encrypted, with no crypto ACL edits",
        "It needs no IKE negotiation because the tunnel interface is always up",
        "It supports only one subnet pair, which makes every tunnel simpler to audit",
        "It removes the need for any MTU or TCP MSS adjustments because tunnel interfaces fragment automatically"
       ],
       "answer": 0,
       "explain": "VTIs let routing decide what is encrypted. They still use IKE, support many subnets and still need MTU care."
      },
      {
       "q": "Counters show encaps increasing and decaps at zero. What should you check first?",
       "options": [
        "Whether the local routing table actually sends user traffic into the tunnel interface",
        "Whether the IKE proposal uses the correct PRF on both peers",
        "Whether the peer routes replies back and ESP is allowed in",
        "Whether the local TCP MSS clamp is configured on the tunnel"
       ],
       "answer": 2,
       "explain": "Local encryption works; the missing direction is the return. A PRF problem would stop the IKE SA forming; local routing is clearly working."
      },
      {
       "q": "Why are `ip mtu 1400` and `ip tcp adjust-mss 1360` applied to a tunnel interface?",
       "options": [
        "To increase throughput by allowing jumbo frames",
        "To force IKEv2 to use UDP 4500 instead of UDP 500 for NAT traversal",
        "To leave room for ESP and tunnel overhead so packets are not fragmented",
        "To make PFS rekeys happen more frequently"
       ],
       "answer": 2,
       "explain": "Encapsulation adds overhead; reducing MTU and MSS prevents oversized packets. It has no effect on ports or rekeying."
      },
      {
       "q": "A partner's logs show TS_UNACCEPTABLE. What does this usually mean?",
       "options": [
        "The proposed traffic selectors do not match the peer's protected subnets",
        "The peer's certificate has expired and failed validation in IKE_AUTH",
        "The Diffie-Hellman groups offered by the two peers do not overlap at all",
        "The pre-shared keys configured on each side differ"
       ],
       "answer": 0,
       "explain": "TS_UNACCEPTABLE concerns traffic selectors. Certificate and PSK issues give authentication failures; DH mismatches give INVALID_KE_PAYLOAD or NO_PROPOSAL_CHOSEN."
      },
      {
       "q": "Why must site-to-site VPN traffic usually be exempted from NAT?",
       "options": [
        "NAT cannot operate on any interface that also has a crypto map or tunnel protection applied",
        "ESP packets are always dropped by NAT devices, even with NAT traversal on",
        "NAT exemption makes IKE authentication faster and reduces rekey failures",
        "Translated packets fall outside the tunnel's protected subnets"
       ],
       "answer": 3,
       "explain": "Translation changes the source address so it falls outside the selectors. NAT can coexist with crypto, and NAT-T handles ESP through NAT."
      }
     ]
    }
   ]
  },
  {
   "id": "m3-l3",
   "title": "Dynamic Hub-and-Spoke and Remote-Access VPN",
   "subtitle": "Scale site-to-site with on-demand spoke tunnels, and choose the right remote-access model",
   "minutes": 30,
   "objectives": [
    "Explain how mGRE, NHRP and IPsec combine into a dynamic hub-and-spoke VPN",
    "Describe spoke-to-spoke shortcut tunnels and their routing requirements",
    "Compare TLS-based and IKEv2-based remote-access VPNs",
    "Design remote-access policy with MFA, posture and least privilege"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "With 200 branches, a full mesh of static tunnels means nearly 20,000 tunnel configurations. A **dynamic hub-and-spoke VPN** avoids this: every spoke builds one permanent tunnel to the hub, and spokes build direct tunnels to each other **on demand** when traffic needs it. The usual building blocks are multipoint GRE (mGRE), the Next Hop Resolution Protocol (NHRP, RFC 2332) and IPsec protection."
    },
    {
     "type": "layers",
     "title": "Dynamic hub-and-spoke building blocks",
     "items": [
      {
       "label": "Routing",
       "parts": [
        "BGP or OSPF over the overlay",
        "Hub advertises summaries or full routes"
       ]
      },
      {
       "label": "NHRP",
       "parts": [
        "Spokes register tunnel-to-public address mappings with the hub",
        "Resolution requests find other spokes",
        "Redirect and shortcut for spoke-to-spoke"
       ]
      },
      {
       "label": "mGRE",
       "parts": [
        "One tunnel interface, many peers",
        "Supports multicast for routing protocols"
       ]
      },
      {
       "label": "IPsec",
       "parts": [
        "Protects GRE in transport mode",
        "IKEv2 with certificates scales best"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Hub tunnel interface",
     "device": "HUB-R1 · IOS-style CLI",
     "lines": [
      "interface Tunnel0",
      " ip address 10.255.0.1 255.255.255.0",
      " ip mtu 1400",
      " ip tcp adjust-mss 1360",
      " ip nhrp network-id 100",
      " ip nhrp map multicast dynamic",
      " ip nhrp redirect",
      " tunnel source GigabitEthernet0/1",
      " tunnel mode gre multipoint",
      " tunnel key 100",
      " tunnel protection ipsec profile IPSEC-OVERLAY"
     ]
    },
    {
     "type": "cli",
     "title": "Spoke tunnel interface",
     "device": "SPOKE-R11 · IOS-style CLI",
     "lines": [
      "interface Tunnel0",
      " ip address 10.255.0.11 255.255.255.0",
      " ip mtu 1400",
      " ip tcp adjust-mss 1360",
      " ip nhrp network-id 100",
      " ip nhrp nhs 10.255.0.1 nbma 203.0.113.1 multicast",
      " ip nhrp shortcut",
      " tunnel source GigabitEthernet0/1",
      " tunnel mode gre multipoint",
      " tunnel key 100",
      " tunnel protection ipsec profile IPSEC-OVERLAY"
     ],
     "note": "The spoke knows only the hub's addresses. Other spokes are discovered through NHRP when traffic flows."
    },
    {
     "type": "topology",
     "title": "Dynamic hub-and-spoke overlay",
     "caption": "Every spoke keeps one permanent protected tunnel to the hub and registers its public (NBMA) address there. Spoke-to-spoke tunnels exist only while traffic needs them, so 200 branches need 200 configurations, not 20,000.",
     "nodes": [
      {
       "id": "dc",
       "kind": "server",
       "label": "HQ data centre",
       "sub": "10.0.0.0/16",
       "x": 5,
       "y": 1
      },
      {
       "id": "hub",
       "kind": "router",
       "label": "HUB-R1",
       "sub": "Tu0 10.255.0.1, NBMA 203.0.113.1",
       "x": 3,
       "y": 1
      },
      {
       "id": "s11",
       "kind": "router",
       "label": "SPOKE-R11",
       "sub": "Tu0 10.255.0.11, LAN 10.11.0.0/16",
       "x": 1,
       "y": 4
      },
      {
       "id": "s12",
       "kind": "router",
       "label": "SPOKE-R12",
       "sub": "Tu0 10.255.0.12, LAN 10.12.0.0/16",
       "x": 5,
       "y": 4
      }
     ],
     "links": [
      {
       "a": "hub",
       "b": "dc"
      },
      {
       "a": "hub",
       "b": "s11",
       "label": "permanent",
       "style": "tunnel"
      },
      {
       "a": "hub",
       "b": "s12",
       "label": "permanent",
       "style": "tunnel"
      },
      {
       "a": "s11",
       "b": "s12",
       "label": "on-demand shortcut",
       "style": "dashed"
      }
     ]
    },
    {
     "type": "sequence",
     "title": "Spoke-to-spoke shortcut with NHRP",
     "caption": "The first packets travel through the hub, which tells the sender a better path exists. Once SPOKE-R12 answers over a new direct IPsec SA, traffic bypasses the hub until the shortcut idles out.",
     "actors": [
      "SPOKE-R11",
      "HUB-R1",
      "SPOKE-R12"
     ],
     "steps": [
      {
       "from": 0,
       "to": 1,
       "label": "Data to 10.12.0.0/16 (via hub)"
      },
      {
       "from": 1,
       "to": 2,
       "label": "Data forwarded to SPOKE-R12"
      },
      {
       "from": 1,
       "to": 0,
       "label": "NHRP redirect",
       "note": "traffic is hairpinning"
      },
      {
       "from": 0,
       "to": 1,
       "label": "NHRP resolution request for 10.12.x"
      },
      {
       "from": 1,
       "to": 2,
       "label": "Resolution request forwarded"
      },
      {
       "from": 2,
       "to": 0,
       "label": "IKEv2 to SPOKE-R11's NBMA address",
       "note": "direct IPsec SA built"
      },
      {
       "from": 2,
       "to": 0,
       "label": "NHRP resolution reply (direct)",
       "reply": true
      },
      {
       "from": 0,
       "to": 2,
       "label": "Data via shortcut route",
       "note": "ages out when idle"
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Spoke-to-spoke tunnels need spokes to reach each other's public addresses on UDP 500/4500. Spokes behind NAT or carrier-grade NAT may fall back to the hub path. Use **certificate authentication** so a single compromised shared key does not let an attacker join the entire overlay.",
     "title": "Spokes behind NAT and security of the overlay"
    },
    {
     "type": "text",
     "text": "Remote-access VPNs connect individual users rather than sites. Two families dominate: **TLS-based** clients (often over TCP or DTLS on port 443) and **IKEv2 clients** with EAP or certificate authentication. Both can be secure; the bigger design decisions are what the user can reach and how strongly the user and device are verified."
    },
    {
     "type": "compare",
     "title": "Remote-access VPN choices",
     "columns": [
      {
       "title": "TLS/DTLS VPN client",
       "items": [
        "Port 443 passes most hotel and guest networks",
        "Often includes posture and per-group policy features",
        "Gateway web portal is a common attack surface; keep it patched and minimal",
        "DTLS (UDP) preferred for performance, TLS fallback"
       ]
      },
      {
       "title": "IKEv2 client",
       "items": [
        "Standards-based; built into many operating systems",
        "EAP methods or certificates for authentication",
        "UDP 500/4500 may be blocked on restrictive networks",
        "MOBIKE (RFC 4555) keeps tunnels up when the client changes address"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Remote-access design decisions",
     "head": [
      "Decision",
      "Secure default",
      "Why"
     ],
     "rows": [
      [
       "Authentication",
       "Phishing-resistant MFA plus device certificate",
       "Stolen passwords alone should never grant network access"
      ],
      [
       "Tunnel mode",
       "Full tunnel for managed devices, or split with cloud web security",
       "Balance visibility against bandwidth and user experience"
      ],
      [
       "Access scope",
       "Group-based ACLs per role, not the whole network",
       "Limits blast radius of a compromised account"
      ],
      [
       "Posture",
       "Check managed state, disk encryption and EDR health before full access",
       "Unhealthy devices get remediation-only access"
      ],
      [
       "Always-on",
       "Enable on managed laptops",
       "Policy and inspection apply even off-site"
      ],
      [
       "Future direction",
       "Per-application access (ZTNA) for third parties first",
       "Removes network-level access entirely"
      ]
     ]
    },
    {
     "type": "scenario",
     "title": "VPN gateway under attack",
     "situation": "Threat intelligence reports active exploitation of a critical flaw in the web portal of the TLS VPN product your company uses. The vendor's patch is released, and your gateway serves 3,000 users.",
     "options": [
      {
       "text": "Apply the patch or vendor mitigation as an emergency change, then hunt for indicators of compromise and rotate credentials and secrets stored on the gateway",
       "feedback": "Best. Patching closes the hole; hunting and rotation address the possibility that exploitation happened before you patched.",
       "best": true
      },
      {
       "text": "Wait for the monthly maintenance window to avoid disrupting users",
       "feedback": "Actively exploited edge-device flaws are emergency changes; waiting weeks invites compromise.",
       "best": false
      },
      {
       "text": "Patch the gateway and close the incident",
       "feedback": "Patching does not remove an attacker who may already have a foothold or stolen session tokens.",
       "best": false
      },
      {
       "text": "Block the portal from the internet permanently",
       "feedback": "This breaks remote access for all users and is not a proportionate first step.",
       "best": false
      }
     ]
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "mGRE, NHRP and IPsec give one hub configuration for many spokes plus on-demand spoke-to-spoke tunnels.",
      "Spokes behind carrier-grade NAT may not form shortcuts; plan for the hub path.",
      "Use per-device certificates so one leaked secret cannot admit an attacker to the whole overlay.",
      "VPN gateways are prime targets: patch as emergency changes, hunt after exposure and move third parties to per-application access."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "In a dynamic hub-and-spoke VPN, what does NHRP provide?",
       "options": [
        "Encryption and integrity protection of the GRE packets between hub and spokes",
        "Mapping overlay addresses to public addresses",
        "Election of a designated router on the overlay network",
        "Assignment of client IP addresses to remote users"
       ],
       "answer": 1,
       "explain": "NHRP resolves overlay-to-underlay addresses. IPsec encrypts, routing protocols handle adjacencies and address pools serve remote users."
      },
      {
       "q": "Why is certificate authentication recommended for large hub-and-spoke overlays?",
       "options": [
        "One leaked shared key would otherwise let an attacker join the entire overlay network",
        "Certificates make the GRE header smaller and reduce per-packet overhead",
        "Pre-shared keys cannot be used with multipoint GRE tunnels in any design",
        "Certificates remove the need for a routing protocol across the overlay network"
       ],
       "answer": 0,
       "explain": "Per-device certificates can be revoked individually. PSKs are technically possible but scale poorly and fail open on leak."
      },
      {
       "q": "Spoke-to-spoke tunnels never form for one branch, though its hub tunnel works. The branch is behind carrier-grade NAT. What is the likely reason?",
       "options": [
        "Its routing protocol is not advertising the hub's summary route",
        "Its tunnel key differs from the tunnel key configured on the hub router",
        "Other spokes cannot reach it on UDP 500/4500 through carrier NAT",
        "Its IPsec profile uses AES-GCM, which other spokes reject for spoke-to-spoke tunnels"
       ],
       "answer": 2,
       "explain": "Inbound reachability through CGNAT is the classic blocker. A wrong tunnel key or profile would break the hub tunnel too."
      },
      {
       "q": "What does MOBIKE add to IKEv2 remote access?",
       "options": [
        "It adds a second authentication factor to the IKE exchange for each user",
        "It keeps the tunnel alive when the client's IP address changes networks",
        "It encrypts DNS queries that the operating system sends outside the tunnel on public Wi-Fi",
        "It enables automatic fallback to TLS over TCP 443 when UDP ports are blocked"
       ],
       "answer": 1,
       "explain": "MOBIKE (RFC 4555) handles address changes. MFA, DNS privacy and TLS fallback are separate features."
      },
      {
       "q": "Which remote-access design best limits the impact of a stolen user account?",
       "options": [
        "Full network access for all users, combined with a longer and more complex password policy",
        "Split tunnelling so that less traffic passes through the gateway",
        "A shorter idle timeout on the VPN portal web page for all users",
        "Role-scoped access plus phishing-resistant MFA and posture checks"
       ],
       "answer": 3,
       "explain": "Least privilege plus strong authentication limits what an attacker can reach. Password length, split tunnelling and timeouts do not limit reach."
      }
     ]
    }
   ]
  },
  {
   "id": "m3-l4",
   "title": "PKI for VPNs and Troubleshooting Negotiation",
   "subtitle": "Run certificates that do not cause outages, and find the exact point where a tunnel fails",
   "minutes": 32,
   "objectives": [
    "Design a PKI hierarchy for VPN authentication with reliable revocation checking",
    "Configure certificate-based IKEv2 authentication in IOS-style syntax",
    "Troubleshoot IKEv2 failures using error notifications and logs",
    "Build a troubleshooting sequence from underlay to Child SA"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Certificates scale VPN authentication: each device proves its identity with its own key pair, and a compromised device can be revoked without touching hundreds of others. But a PKI that is badly run causes outages — expired certificates, unreachable revocation servers and clocks out of sync are among the most common VPN failures."
    },
    {
     "type": "layers",
     "title": "A two-tier PKI for network devices",
     "items": [
      {
       "label": "Offline root CA",
       "parts": [
        "Kept offline, used rarely",
        "Long validity",
        "Signs issuing CAs only"
       ]
      },
      {
       "label": "Issuing CA",
       "parts": [
        "Online, signs device certificates",
        "Publishes CRLs and runs OCSP",
        "Supports automated enrolment"
       ]
      },
      {
       "label": "Revocation services",
       "parts": [
        "CRL distribution points (HTTP)",
        "OCSP responder",
        "Must be reachable by every VPN peer"
       ]
      },
      {
       "label": "End entities",
       "parts": [
        "Routers, firewalls, VPN clients",
        "Short-lived certificates, auto-renewed",
        "Identity in subject and SAN"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Revocation checking options",
     "head": [
      "Method",
      "How it works",
      "Operational risk"
     ],
     "rows": [
      [
       "CRL",
       "Peer downloads a signed list of revoked serial numbers from the CDP URL",
       "Large lists; stale if not refreshed; peer must reach the CDP"
      ],
      [
       "OCSP",
       "Peer asks a responder for the status of one certificate",
       "Responder must be highly available and reachable; note that public web PKI is moving back to CRLs (OCSP became optional for public CAs), but private VPN PKIs can still run OCSP"
      ],
      [
       "None",
       "No revocation check",
       "A revoked or stolen device certificate still authenticates — avoid"
      ],
      [
       "Fallback chain",
       "Try OCSP, then CRL, then optionally none",
       "'None' as a last fallback silently disables revocation during outages"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Certificate-based IKEv2 on a branch router",
     "device": "BR-R1 · IOS-style CLI",
     "lines": [
      "crypto key generate rsa label BR-R1-KEY modulus 3072",
      "crypto pki trustpoint CORP-ISSUING-CA",
      " enrollment url http://10.0.0.50:80",
      " subject-name CN=br-r1.branch.corp.example,O=Example Corp",
      " revocation-check crl",
      " rsakeypair BR-R1-KEY",
      "crypto pki authenticate CORP-ISSUING-CA",
      "crypto pki enroll CORP-ISSUING-CA",
      "crypto ikev2 profile PROF-HQ-CERT",
      " match identity remote fqdn hub1.corp.example",
      " identity local fqdn br-r1.branch.corp.example",
      " authentication local rsa-sig",
      " authentication remote rsa-sig",
      " pki trustpoint CORP-ISSUING-CA"
     ],
     "note": "Check the issuing CA's fingerprint out of band when `crypto pki authenticate` displays it. Make sure the router's clock is synchronised with NTP before enrolment."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Certificates are valid only between their 'not before' and 'not after' times. A router whose clock reset to a default date after a power loss will reject every valid certificate. Run authenticated NTP from reliable sources and alert on clock offset.",
     "title": "Time is a security dependency"
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Public TLS certificate lifetimes are shrinking across the industry (for example, the maximum validity for publicly trusted server certificates is 200 days from March 2026, falling further in later years). Private VPN PKIs are not bound by those rules, but the lesson applies: use automated enrolment and renewal (SCEP, EST or ACME) and monitor expiry dates centrally.",
     "title": "Automate certificate life cycles"
    },
    {
     "type": "packet",
     "title": "IKEv2 header (RFC 7296)",
     "width": 32,
     "fields": [
      {
       "label": "IKE SA Initiator's SPI",
       "bits": 64
      },
      {
       "label": "IKE SA Responder's SPI",
       "bits": 64
      },
      {
       "label": "Next payload",
       "bits": 8
      },
      {
       "label": "MjVer",
       "bits": 4
      },
      {
       "label": "MnVer",
       "bits": 4
      },
      {
       "label": "Exchange type",
       "bits": 8
      },
      {
       "label": "Flags",
       "bits": 8
      },
      {
       "label": "Message ID",
       "bits": 32
      },
      {
       "label": "Length",
       "bits": 32
      }
     ],
     "caption": "Every IKEv2 message starts with these 28 bytes. In a capture, a responder SPI of zero means IKE_SA_INIT has not been answered yet, and the exchange type tells you which stage failed."
    },
    {
     "type": "table",
     "title": "Common IKEv2 failures and their signatures",
     "head": [
      "Symptom or notify",
      "Typical cause",
      "Fix"
     ],
     "rows": [
      [
       "No response to IKE_SA_INIT",
       "UDP 500/4500 blocked, wrong peer address, peer not configured",
       "Capture on the outside interface; check ACLs and upstream firewalls"
      ],
      [
       "NO_PROPOSAL_CHOSEN",
       "No overlap in encryption, PRF, integrity or DH group",
       "Compare proposals line by line against the parameter sheet"
      ],
      [
       "INVALID_KE_PAYLOAD",
       "Initiator guessed a DH group the responder will not use",
       "Normally self-corrects by retrying with the requested group; persistent if no common group"
      ],
      [
       "AUTHENTICATION_FAILED",
       "PSK mismatch, wrong identity, untrusted or revoked certificate",
       "Check identities and trust chain; verify revocation reachability"
      ],
      [
       "TS_UNACCEPTABLE",
       "Traffic selectors do not match",
       "Mirror the crypto ACLs or use 0.0.0.0/0 selectors on VTIs"
      ],
      [
       "Tunnel up, traffic fails",
       "Routing, NAT before encryption, MTU or filtered ESP",
       "Check counters, routes, NAT exemption and MSS"
      ]
     ]
    },
    {
     "type": "sequence",
     "title": "Certificate authentication inside IKE_AUTH",
     "caption": "The responder validates the chain and dates, then asks the revocation service before trusting the peer. If that service cannot be reached the tunnel fails even though the certificate is good, which is exactly what the log below shows.",
     "actors": [
      "Branch (initiator)",
      "Hub (responder)",
      "CRL / OCSP service"
     ],
     "steps": [
      {
       "from": 0,
       "to": 1,
       "label": "IKE_AUTH {IDi CERT AUTH}",
       "note": "+ SAi2, TSi, TSr"
      },
      {
       "from": 1,
       "to": 1,
       "label": "Verify chain to the root CA",
       "note": "and validity dates (needs NTP)"
      },
      {
       "from": 1,
       "to": 2,
       "label": "Revocation check (serial)"
      },
      {
       "from": 2,
       "to": 1,
       "label": "good / revoked / no answer",
       "reply": true
      },
      {
       "from": 1,
       "to": 0,
       "label": "IKE_AUTH {IDr CERT AUTH}",
       "note": "if good",
       "reply": true
      },
      {
       "from": 1,
       "to": 0,
       "label": "AUTHENTICATION_FAILED",
       "note": "if revoked or unreachable",
       "reply": true
      }
     ]
    },
    {
     "type": "cli",
     "title": "Negotiation log excerpt",
     "device": "HUB-R1 · syslog (illustrative)",
     "lines": [
      "IKEv2: Received IKE_SA_INIT from 198.51.100.77:500",
      "IKEv2: Selected proposal AES-GCM-256/PRF-SHA384/DH-20",
      "IKEv2: Received IKE_AUTH, peer identity FQDN br-r7.branch.corp.example",
      "IKEv2: Certificate chain verified to CORP-ROOT-CA",
      "IKEv2: Revocation check: CRL fetch from http://pki.corp.example/issuing.crl failed (timeout)",
      "IKEv2: Sending notify AUTHENTICATION_FAILED to 198.51.100.77"
     ],
     "note": "Negotiation and the chain are fine; authentication fails because the hub cannot reach the CRL distribution point. Fix reachability or CRL caching rather than disabling revocation."
    },
    {
     "type": "steps",
     "title": "Troubleshooting order: bottom up",
     "items": [
      {
       "title": "Underlay",
       "text": "Can the peers ping each other's public addresses? Is UDP 500/4500 (and ESP if no NAT) permitted?"
      },
      {
       "title": "IKE_SA_INIT",
       "text": "Do proposals overlap? Look for NO_PROPOSAL_CHOSEN or no response."
      },
      {
       "title": "IKE_AUTH",
       "text": "Do identities match the profile? Is the PSK or certificate chain valid, current and not revoked?"
      },
      {
       "title": "Child SA",
       "text": "Do traffic selectors and PFS settings match? Look for TS_UNACCEPTABLE or rekey failures."
      },
      {
       "title": "Data plane",
       "text": "Are encaps/decaps counters increasing both ways? Check routing, NAT exemption and MTU."
      },
      {
       "title": "Stability",
       "text": "Check DPD settings, lifetimes and whether both sides initiate at the same time."
      }
     ]
    },
    {
     "type": "case",
     "title": "Garment exporter's VPN outage",
     "context": "A garment exporter in Chattogram connects 14 factory sites to its Dhaka head office with certificate-based IKEv2 tunnels. On a Monday morning, nine factories lose their tunnels within two hours; five stay up. The network team's first move was to disable revocation checking on the hub, which restored the tunnels. Investigation later shows the issuing CA's CRL had expired on Sunday night because the scheduled publication job failed, and the five surviving tunnels simply had not yet re-authenticated.",
     "questions": [
      "Why did only some tunnels fail at first?",
      "What was the risk of the team's quick fix?",
      "How should the PKI and monitoring be changed?",
      "What would a better emergency response have looked like?"
     ],
     "answer": "**Partial failure:** tunnels re-authenticate when IKE SAs are re-established, rekeyed with reauthentication, or after drops; the nine sites happened to re-authenticate first and hit the expired CRL, the rest were still running on established SAs. **Risk of the quick fix:** disabling revocation means a stolen or revoked device certificate would be accepted — and the change was not time-limited or documented, so it might stay forever. **Changes:** monitor CRL `next update` times and alert well before expiry; publish CRLs with overlap (new CRL issued well before the old one expires); add an OCSP responder with high availability; make the CDP reachable over redundant paths; include PKI services in the change and incident runbooks. **Better response:** publish a fresh CRL manually from the issuing CA (minutes of work), confirm the tunnels recover, and if revocation must be relaxed, do it as a documented, time-boxed emergency change with an owner."
    },
    {
     "type": "checklist",
     "title": "VPN go-live checklist",
     "items": [
      "Parameter sheet agreed and signed off by both parties",
      "UDP 500, UDP 4500 and ESP permitted on every firewall in the path",
      "NTP synchronised and authenticated on all VPN peers",
      "Certificate chain, CRL and OCSP reachability tested from each peer",
      "Certificate and CRL expiry monitored with alerts",
      "NAT exemption in place for protected traffic",
      "Tunnel MTU and TCP MSS adjusted and tested with large transfers",
      "DPD configured and failover path tested",
      "VPN logs forwarded to the SIEM, including authentication failures"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "IKEv2",
       "def": "The Internet Key Exchange protocol version 2 (RFC 7296), which authenticates peers and negotiates IPsec security associations."
      },
      {
       "term": "Security association (SA)",
       "def": "A set of agreed keys and parameters protecting traffic in one direction (Child SA) or the IKE control channel (IKE SA)."
      },
      {
       "term": "SPI",
       "def": "Security Parameter Index: a value in each ESP packet identifying which SA protects it."
      },
      {
       "term": "ESP",
       "def": "Encapsulating Security Payload, IP protocol 50, providing confidentiality and integrity."
      },
      {
       "term": "NAT-T",
       "def": "NAT traversal: wrapping ESP in UDP 4500 so it can pass NAT devices."
      },
      {
       "term": "PFS",
       "def": "Perfect forward secrecy: deriving each new key from a fresh DH exchange so one compromise does not expose other sessions."
      },
      {
       "term": "Traffic selector",
       "def": "The address and port ranges a Child SA is permitted to protect."
      },
      {
       "term": "VTI",
       "def": "Virtual tunnel interface: a routable interface whose traffic is protected by IPsec."
      },
      {
       "term": "NHRP",
       "def": "Next Hop Resolution Protocol, used to map overlay tunnel addresses to underlay public addresses."
      },
      {
       "term": "CRL",
       "def": "Certificate revocation list: a signed list of revoked certificate serial numbers published by a CA."
      },
      {
       "term": "OCSP",
       "def": "Online Certificate Status Protocol: a real-time query for the revocation status of one certificate."
      },
      {
       "term": "DPD",
       "def": "Dead peer detection: liveness checks that remove SAs to an unreachable peer."
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "If your issuing CA's CRL expired tonight, which tunnels or services would fail first, and who would notice? Write the alert you wish existed."
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "Run a two-tier PKI with an offline root and automated enrolment and renewal for every VPN peer.",
      "Revocation services and accurate time are hard dependencies: monitor CRL next-update, OCSP health and clock offset.",
      "Never 'fix' a revocation outage by permanently disabling revocation; republish the CRL or restore OCSP.",
      "Troubleshoot bottom-up: underlay, IKE_SA_INIT, IKE_AUTH, Child SA, then data-plane counters."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A tunnel fails with NO_PROPOSAL_CHOSEN in IKE_SA_INIT. What is the first thing to compare?",
       "options": [
        "The traffic selectors and protected subnets configured on both peers",
        "The crypto proposal lists configured on both peers",
        "The certificate serial numbers on both peers",
        "The tunnel MTU and TCP MSS on both peers"
       ],
       "answer": 1,
       "explain": "NO_PROPOSAL_CHOSEN in IKE_SA_INIT means no common crypto suite. Selectors, certificates and MTU are checked later in the sequence."
      },
      {
       "q": "Logs show the certificate chain verifies but authentication fails after a CRL fetch timeout. What is the best fix?",
       "options": [
        "Disable revocation checking permanently on the hub so it cannot happen again",
        "Replace the device certificate on the remote peer",
        "Change the DH group to a stronger elliptic curve",
        "Restore access to the CRL distribution point"
       ],
       "answer": 3,
       "explain": "The failure is revocation-service reachability. Disabling revocation removes protection; the certificate and DH group are not at fault."
      },
      {
       "q": "After a power cut, a router rejects every certificate as 'not yet valid'. What is the likely cause?",
       "options": [
        "Its clock was reset and NTP has not yet resynchronised it",
        "The issuing CA revoked all device certificates",
        "The router's RSA key was deleted during the outage",
        "The peers switched from IKEv2 to IKEv1"
       ],
       "answer": 0,
       "explain": "'Not yet valid' points to a clock earlier than the certificate's start time. Revocation and key loss give different errors."
      },
      {
       "q": "Why is 'none' as the final revocation fallback risky?",
       "options": [
        "It makes every IKE negotiation slower by several seconds while it times out",
        "It forces peers to fall back from certificates to pre-shared key authentication",
        "Revoked certificates would be silently accepted during an outage",
        "It prevents automatic certificate renewal through enrolment"
       ],
       "answer": 2,
       "explain": "A fallback to none quietly disables revocation exactly when you cannot see it. It does not change authentication method or renewal."
      },
      {
       "q": "What is the correct order for troubleshooting a site-to-site tunnel?",
       "options": [
        "Data-plane counters first, then certificates, then underlay reachability last",
        "Child SA settings first, because most tunnel failures happen at that stage",
        "Underlay, IKE_SA_INIT, IKE_AUTH, Child SA, then data-plane counters",
        "Firewall rules for user traffic first, then the IKE and IPsec settings on both peers"
       ],
       "answer": 2,
       "explain": "Working bottom-up avoids chasing symptoms; each stage depends on the one below it."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m4",
 "order": 4,
 "code": "Identity",
 "title": "Identity & Network Access Control",
 "subtitle": "Know every user and device before access: AAA, 802.1X, NAC, posture, MFA and identity-based segmentation",
 "outcomes": [
  "Choose and harden RADIUS and TACACS+ for network access and device administration",
  "Design 802.1X with the right EAP methods and secure supplicant configuration",
  "Deploy MAB, dynamic authorisation and change of authorisation through phased rollout",
  "Build posture, guest and BYOD flows and a NAC policy matrix",
  "Apply phishing-resistant MFA and identity-based segmentation"
 ],
 "lessons": [
  {
   "id": "m4-l1",
   "title": "AAA, RADIUS and TACACS+",
   "subtitle": "Authentication, authorisation and accounting for network access and for device administration",
   "minutes": 28,
   "objectives": [
    "Explain the three A's and where each is enforced",
    "Compare RADIUS and TACACS+ and choose the right one for each use",
    "Configure TACACS+ device administration with command authorisation and accounting",
    "Harden RADIUS against known protocol weaknesses"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Identity is the layer that turns 'a device on port 14' into 'Rahim's managed laptop, compliant, in the Finance role'. Every identity control in this module rests on **AAA**: authentication (who are you?), authorisation (what may you do?) and accounting (what did you do?)."
    },
    {
     "type": "framework",
     "title": "The three A's",
     "items": [
      {
       "label": "A1",
       "title": "Authentication",
       "text": "Proves identity with passwords, certificates, tokens or biometrics; the result is accept or reject."
      },
      {
       "label": "A2",
       "title": "Authorisation",
       "text": "Decides what an authenticated subject may do: VLAN, ACL, group tag, privilege level or allowed commands."
      },
      {
       "label": "A3",
       "title": "Accounting",
       "text": "Records sessions and actions: start, stop, duration, bytes, commands entered. Essential for forensics and audits."
      }
     ]
    },
    {
     "type": "compare",
     "title": "RADIUS versus TACACS+",
     "columns": [
      {
       "title": "RADIUS (RFC 2865/2866)",
       "items": [
        "UDP 1812 (auth) and 1813 (accounting)",
        "Authentication and authorisation combined in Access-Accept",
        "Only the User-Password attribute is hidden; other attributes in clear",
        "Carries EAP for 802.1X; supports change of authorisation (RFC 5176)",
        "Primary use: network access (802.1X, MAB, VPN, Wi-Fi)"
       ]
      },
      {
       "title": "TACACS+ (RFC 8907)",
       "items": [
        "TCP 49",
        "Authentication, authorisation and accounting are separate exchanges",
        "Whole packet body obfuscated with the shared key (not strong encryption)",
        "Per-command authorisation and command accounting",
        "Primary use: device administration (who may run which commands)"
       ]
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "RADIUS integrity relies on MD5-based authenticators. In 2024 researchers showed that an on-path attacker could forge an Access-Accept for some non-EAP authentication types by exploiting MD5 collisions (known as **BlastRADIUS**). Mitigations: update servers and clients, **require the Message-Authenticator attribute** on all requests and responses, keep RADIUS on protected management networks, and move to **RADIUS over TLS (RadSec)** where supported, because TLS protects the whole exchange instead of relying on MD5. Use long, unique shared secrets per client.",
     "title": "RADIUS protocol weaknesses"
    },
    {
     "type": "packet",
     "title": "RADIUS packet (RFC 2865)",
     "width": 32,
     "fields": [
      {
       "label": "Code",
       "bits": 8
      },
      {
       "label": "Identifier",
       "bits": 8
      },
      {
       "label": "Length",
       "bits": 16
      },
      {
       "label": "Authenticator (16 bytes, MD5-based in responses)",
       "bits": 128
      },
      {
       "label": "Attributes: type-length-value, incl. Message-Authenticator (type 80)",
       "bits": 32,
       "variable": true
      }
     ],
     "caption": "The 16-byte Response Authenticator is an MD5 hash over the packet and the shared secret, which is the weakness BlastRADIUS exploits. The Message-Authenticator attribute adds an HMAC over the whole packet, so requiring it closes the gap."
    },
    {
     "type": "cli",
     "title": "TACACS+ device administration with command authorisation",
     "device": "CORE1 · IOS-style CLI",
     "lines": [
      "aaa new-model",
      "tacacs server TAC-1",
      " address ipv4 10.250.0.20",
      " key <unique-secret-from-vault>",
      "aaa group server tacacs+ TAC-SERVERS",
      " server name TAC-1",
      "aaa authentication login ADMIN group TAC-SERVERS local",
      "aaa authorization exec ADMIN group TAC-SERVERS local if-authenticated",
      "aaa authorization commands 15 ADMIN group TAC-SERVERS local if-authenticated",
      "aaa accounting commands 15 ADMIN start-stop group TAC-SERVERS",
      "line vty 0 15",
      " login authentication ADMIN",
      " authorization exec ADMIN",
      " authorization commands 15 ADMIN",
      " accounting commands 15 ADMIN",
      " transport input ssh"
     ],
     "note": "The `local` fallback is used only if no TACACS+ server responds. Keep one break-glass local account with a vaulted password and alert whenever it is used."
    },
    {
     "type": "sequence",
     "title": "TACACS+: separate authentication, authorisation and accounting",
     "caption": "Each A is its own exchange over TCP 49, so the server can approve the shell but still refuse an individual command, and every command lands in an accounting record outside the device.",
     "actors": [
      "Engineer",
      "CORE1",
      "TACACS+ server"
     ],
     "steps": [
      {
       "from": 0,
       "to": 1,
       "label": "SSH login as a.rahman"
      },
      {
       "from": 1,
       "to": 2,
       "label": "AUTHEN START (username)"
      },
      {
       "from": 2,
       "to": 1,
       "label": "REPLY: GETPASS",
       "reply": true
      },
      {
       "from": 1,
       "to": 2,
       "label": "CONTINUE (password + MFA)"
      },
      {
       "from": 2,
       "to": 1,
       "label": "REPLY: PASS",
       "reply": true
      },
      {
       "from": 1,
       "to": 2,
       "label": "AUTHOR REQUEST: service=shell"
      },
      {
       "from": 2,
       "to": 1,
       "label": "RESPONSE: PASS_ADD priv-lvl=15",
       "reply": true
      },
      {
       "from": 0,
       "to": 1,
       "label": "router bgp 65000"
      },
      {
       "from": 1,
       "to": 2,
       "label": "AUTHOR REQUEST: cmd=router bgp"
      },
      {
       "from": 2,
       "to": 1,
       "label": "RESPONSE: PASS_ADD (or FAIL)",
       "note": "role decides per command",
       "reply": true
      },
      {
       "from": 1,
       "to": 2,
       "label": "ACCT REQUEST: command record"
      },
      {
       "from": 2,
       "to": 1,
       "label": "ACCT REPLY: SUCCESS",
       "reply": true
      }
     ]
    },
    {
     "type": "table",
     "title": "Device-administration roles",
     "head": [
      "Role",
      "Privilege",
      "Example authorised commands",
      "Approval"
     ],
     "rows": [
      [
       "NOC read-only",
       "Show and ping only",
       "show *, ping, traceroute",
       "Standing"
      ],
      [
       "Network engineer",
       "Configure interfaces and routing",
       "interface, router, ip route; not aaa or crypto key",
       "Standing, reviewed quarterly"
      ],
      [
       "Security engineer",
       "AAA, crypto and firewall policy",
       "aaa, crypto, access-list, zone",
       "Standing, reviewed quarterly"
      ],
      [
       "Break-glass",
       "Full",
       "All",
       "Emergency only; dual control and alert"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "Command accounting gives you a tamper-resistant record of who changed what and when, outside the device itself. During an incident, it answers 'did the attacker change configuration?' within minutes. Stream it to the SIEM and protect it from deletion by network administrators.",
     "title": "Accounting is evidence"
    },
    {
     "type": "scenario",
     "title": "Choosing the protocol",
     "situation": "A university wants to (1) authenticate students on Wi-Fi with 802.1X and (2) restrict which engineers can change routing on core routers, with a full record of commands.",
     "options": [
      {
       "text": "TACACS+ for both, because it encrypts the whole packet",
       "feedback": "TACACS+ is not used to carry 802.1X EAP from access points and switches.",
       "best": false
      },
      {
       "text": "RADIUS for Wi-Fi 802.1X and TACACS+ for device administration with command authorisation and accounting",
       "feedback": "Correct. RADIUS carries EAP and returns network authorisation; TACACS+ separates authorisation per command and logs each command.",
       "best": true
      },
      {
       "text": "RADIUS for both, with privilege levels sent in Access-Accept",
       "feedback": "Possible for basic privilege levels, but it lacks practical per-command authorisation and command accounting.",
       "best": false
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Who can log in to your core network devices today, how are their commands authorised, and where is the record of what they did? Note any shared accounts you find."
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "Authentication proves who, authorisation decides what, accounting records what happened.",
      "Use RADIUS for network access (it carries EAP and supports CoA) and TACACS+ for device administration.",
      "Mitigate BlastRADIUS: patch, require Message-Authenticator, keep RADIUS on protected networks and prefer RADIUS over TLS.",
      "Named admin accounts, per-command authorisation and protected command accounting turn administration into evidence."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Which statement about RADIUS is correct?",
       "options": [
        "It returns authentication and authorisation in one Access-Accept",
        "It uses TCP port 49 and obfuscates the entire packet body with the key",
        "It is mainly used for per-command authorisation and command accounting on routers and switches",
        "It cannot carry EAP and is therefore not used for 802.1X authentication"
       ],
       "answer": 0,
       "explain": "RADIUS combines authentication and authorisation in its response and carries EAP for 802.1X. TCP 49 and per-command authorisation describe TACACS+."
      },
      {
       "q": "Why is TACACS+ preferred for device administration?",
       "options": [
        "It uses strong modern encryption for the whole packet, which RADIUS lacks",
        "It is the only protocol that supports multi-factor authentication",
        "It runs over UDP, so it is faster than RADIUS",
        "It authorises and accounts for individual commands in separate AAA exchanges"
       ],
       "answer": 3,
       "explain": "Per-command authorisation and accounting are the key benefits. TACACS+ body obfuscation is not strong encryption, MFA is possible with both, and it runs over TCP."
      },
      {
       "q": "Which mitigation directly addresses the 2024 RADIUS forgery weakness?",
       "options": [
        "Moving RADIUS from UDP 1812 to the legacy port 1645 on every client",
        "Requiring Message-Authenticator on all requests and responses",
        "Increasing the RADIUS server timeout to ten seconds and the retry count to five",
        "Disabling RADIUS accounting messages on all network access devices"
       ],
       "answer": 1,
       "explain": "Message-Authenticator provides an HMAC over the packet, blocking the forgery. Port, timeout and accounting changes do not help."
      },
      {
       "q": "What is the role of the `local` keyword at the end of an AAA method list?",
       "options": [
        "It is used only when no AAA server responds",
        "It is tried first, before any of the AAA servers are contacted",
        "It is used when the AAA server rejects the password",
        "It replaces TACACS+ for all console logins"
       ],
       "answer": 0,
       "explain": "Local is a fallback for unreachable servers. A reject from the server ends the attempt; it does not fall through to local."
      },
      {
       "q": "What should happen whenever the break-glass local account is used?",
       "options": [
        "Nothing, because local accounts are not logged by design on network devices",
        "The account is automatically deleted from all devices once the session ends",
        "An alert fires and the use is reviewed as an emergency event",
        "Command accounting is disabled for the duration so that the emergency fix is not slowed down"
       ],
       "answer": 2,
       "explain": "Break-glass use should be rare and visible. Silent use, automatic deletion or disabling accounting all undermine control."
      }
     ]
    }
   ]
  },
  {
   "id": "m4-l2",
   "title": "IEEE 802.1X and EAP Methods",
   "subtitle": "How port-based access control works, and how to choose an EAP method that resists credential theft",
   "minutes": 30,
   "objectives": [
    "Identify the supplicant, authenticator and authentication server roles",
    "Trace an 802.1X exchange from EAPOL to RADIUS and back",
    "Compare EAP-TLS, PEAP, EAP-TTLS and TEAP",
    "Explain why server-certificate validation on the client is critical"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "**IEEE 802.1X** is port-based network access control. Until a device proves its identity, the switch port or Wi-Fi association allows only authentication traffic. It works the same way on wired and wireless networks and is the foundation of modern NAC."
    },
    {
     "type": "framework",
     "title": "The three 802.1X roles",
     "items": [
      {
       "label": "SUP",
       "title": "Supplicant",
       "text": "Software on the endpoint that presents credentials (built into all major operating systems)."
      },
      {
       "label": "AUTH",
       "title": "Authenticator",
       "text": "The switch or wireless controller/access point that controls the port and relays EAP; it never sees the credentials inside the TLS tunnel."
      },
      {
       "label": "AS",
       "title": "Authentication server",
       "text": "The NAC/RADIUS server that validates credentials and returns the authorisation decision."
      }
     ]
    },
    {
     "type": "sequence",
     "title": "An 802.1X exchange with EAP-TLS",
     "caption": "The switch only relays: EAP rides in EAPOL frames (EtherType 0x888E) toward the endpoint and inside RADIUS toward the server. The credentials sit inside the TLS tunnel, and the decision arrives as attributes in Access-Accept.",
     "actors": [
      "Supplicant",
      "Authenticator (switch)",
      "NAC / RADIUS server"
     ],
     "steps": [
      {
       "from": 1,
       "to": 0,
       "label": "EAP-Request/Identity",
       "note": "port unauthorised: EAPOL only"
      },
      {
       "from": 0,
       "to": 1,
       "label": "EAP-Response/Identity",
       "note": "outer identity, e.g. anonymous@",
       "reply": true
      },
      {
       "from": 1,
       "to": 2,
       "label": "Access-Request (EAP-Message)"
      },
      {
       "from": 2,
       "to": 1,
       "label": "Access-Challenge (EAP-TLS start)",
       "reply": true
      },
      {
       "from": 1,
       "to": 0,
       "label": "EAP-Request (TLS)",
       "note": "relayed over EAPOL"
      },
      {
       "from": 0,
       "to": 2,
       "label": "EAP-TLS handshake, several round trips",
       "note": "EAPOL ↔ RADIUS relay"
      },
      {
       "from": 2,
       "to": 1,
       "label": "Access-Accept: VLAN, dACL, tag",
       "note": "plus key material for Wi-Fi",
       "reply": true
      },
      {
       "from": 1,
       "to": 0,
       "label": "EAP-Success",
       "note": "port authorised, policy applied"
      }
     ]
    },
    {
     "type": "packet",
     "title": "EAPOL frame carrying an EAP packet (IEEE 802.1X)",
     "width": 32,
     "fields": [
      {
       "label": "EAPOL version",
       "bits": 8
      },
      {
       "label": "Packet type (0 = EAP)",
       "bits": 8
      },
      {
       "label": "Packet body length",
       "bits": 16
      },
      {
       "label": "EAP code",
       "bits": 8
      },
      {
       "label": "Identifier",
       "bits": 8
      },
      {
       "label": "EAP length",
       "bits": 16
      },
      {
       "label": "Type (13 = EAP-TLS)",
       "bits": 8
      },
      {
       "label": "Type data",
       "bits": 24,
       "variable": true
      }
     ],
     "caption": "On the wire toward the endpoint, EAP rides directly in an Ethernet frame with EtherType 0x888E; the switch copies the same EAP packet into a RADIUS EAP-Message attribute toward the server. Codes 1 to 4 are Request, Response, Success and Failure."
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "On Wi-Fi, a successful EAP method also produces keying material. The RADIUS server sends it to the access point, and the 4-way handshake derives the per-session encryption keys. This is why WPA2/WPA3-Enterprise gives every user a unique key, unlike a shared passphrase.",
     "title": "Keys for wireless"
    },
    {
     "type": "table",
     "title": "EAP methods compared",
     "head": [
      "Method",
      "Client credential",
      "Server credential",
      "Strength",
      "Weakness"
     ],
     "rows": [
      [
       "EAP-TLS",
       "Client certificate",
       "Server certificate",
       "Mutual certificate authentication; no password to phish",
       "Needs certificate issuance to every device"
      ],
      [
       "PEAP (inner MSCHAPv2)",
       "Username and password",
       "Server certificate",
       "Easy to deploy with a directory",
       "Password-based; if the client does not validate the server, credentials can be captured and cracked. Modern operating systems increasingly block saved MSCHAPv2 credentials under built-in credential protection, which pushes migration to certificates"
      ],
      [
       "EAP-TTLS",
       "Password or inner EAP",
       "Server certificate",
       "Flexible inner methods",
       "Same server-validation risk as PEAP"
      ],
      [
       "TEAP (RFC 7170)",
       "Machine and user credentials, chained",
       "Server certificate",
       "Authenticates both device and user in one session",
       "Newer; check supplicant and server support"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Password-based tunnelled methods are only as safe as the client's server validation. If supplicants accept any certificate, an attacker with a fake access point ('evil twin') can terminate the tunnel and harvest credential exchanges. Push profiles that **pin the trusted CA and the exact server name**, and never let users click 'trust' on an unknown certificate.",
     "title": "Validate the server, always"
    },
    {
     "type": "compare",
     "title": "Choosing a method",
     "columns": [
      {
       "title": "Prefer EAP-TLS when",
       "items": [
        "Devices are managed and can receive certificates automatically",
        "You want phishing-resistant network authentication",
        "You need to separate machine and user identities clearly"
       ]
      },
      {
       "title": "Accept PEAP/TTLS temporarily when",
       "items": [
        "Devices are unmanaged and certificate enrolment is not yet possible",
        "Server validation is enforced through managed profiles",
        "There is a dated plan to migrate to certificates"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "NAC server authentication log (EAP-TLS)",
     "device": "NAC-1 · authentication log (illustrative)",
     "lines": [
      "2026-03-02 08:14:51 RADIUS Access-Request from 10.10.1.5 (SW-ACC-07) port Gi1/0/10",
      "  Calling-Station-Id=3C-22-FB-10-4A-7E  NAS-Port-Type=Ethernet",
      "  EAP method=EAP-TLS  outer identity=anonymous@corp.example",
      "  Client cert CN=LT-0457.corp.example issuer=CORP-ISSUING-CA  revocation=good (OCSP)",
      "  Policy matched: Wired-Corp-Managed  -> Authz profile: EMPLOYEE-ACCESS",
      "  Access-Accept: Tunnel-Private-Group-ID=20, Filter-Id=EMPLOYEE-ACL"
     ],
     "note": "An anonymous outer identity hides the real identity from anyone watching the cleartext part of the exchange; the real identity is inside the TLS tunnel."
    },
    {
     "type": "scenario",
     "title": "Evil-twin risk",
     "situation": "A penetration test shows that 40% of staff laptops connect to a fake corporate SSID and send PEAP exchanges to the tester's server, because the Wi-Fi profiles were configured manually by users years ago.",
     "options": [
      {
       "text": "Force all staff to change their passwords",
       "feedback": "This helps once but leaves the flaw that let credentials be captured.",
       "best": false
      },
      {
       "text": "Hide the corporate SSID so attackers cannot copy it",
       "feedback": "Hidden SSIDs are easily discovered and make clients probe for them everywhere.",
       "best": false
      },
      {
       "text": "Switch the SSID to WPA3-Personal with a strong passphrase",
       "feedback": "A shared passphrase loses per-user identity and is not appropriate for enterprise access.",
       "best": false
      },
      {
       "text": "Push managed Wi-Fi profiles that pin the CA and server name, and plan migration to EAP-TLS with automatic certificate enrolment",
       "feedback": "Best. It fixes the immediate validation gap and removes passwords from Wi-Fi authentication over time.",
       "best": true
      }
     ]
    },
    {
     "type": "reflection",
     "prompt": "Which EAP method does your organisation use on wired and on Wi-Fi? How do you know clients really validate the server certificate?"
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "802.1X has three roles: supplicant, authenticator (which relays) and authentication server (which decides).",
      "Until authorised, a closed-mode port passes only EAPOL; the result arrives as RADIUS attributes.",
      "EAP-TLS is the target: mutual certificates and no password to phish; TEAP chains machine and user.",
      "Password-based tunnelled methods are safe only if every client pins the CA and server name."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "In 802.1X, which component relays EAP between the endpoint and the RADIUS server?",
       "options": [
        "The supplicant software running on the endpoint operating system",
        "The authenticator, such as an access switch",
        "The directory service that stores the user and computer accounts",
        "The certificate authority that issued the RADIUS server's certificate"
       ],
       "answer": 1,
       "explain": "The authenticator relays EAP over EAPOL on one side and RADIUS on the other. The supplicant presents credentials; the directory and CA are back-end services."
      },
      {
       "q": "Before authentication succeeds, what traffic does an 802.1X-controlled port accept?",
       "options": [
        "DHCP and DNS only, so that the device can locate the NAC server",
        "All traffic but at reduced bandwidth",
        "Only traffic to the default gateway",
        "Only EAPOL frames (closed mode)"
       ],
       "answer": 3,
       "explain": "In closed mode, only EAPOL passes until authorisation. Allowing DHCP or DNS before authentication is a deliberate low-impact choice, not the default."
      },
      {
       "q": "Which EAP method provides mutual certificate-based authentication with no user password?",
       "options": [
        "PEAP with MSCHAPv2",
        "EAP-TLS",
        "EAP-TTLS with PAP",
        "MAC authentication bypass"
       ],
       "answer": 1,
       "explain": "EAP-TLS uses certificates on both sides. PEAP and TTLS typically carry passwords, and MAB uses the MAC address."
      },
      {
       "q": "Why must supplicants pin the trusted CA and server name for PEAP?",
       "options": [
        "Otherwise the RADIUS shared secret is sent across the network in clear text",
        "Otherwise the switch cannot assign a dynamic VLAN to the session",
        "Otherwise accounting records are not generated",
        "Otherwise a rogue server can terminate the tunnel and capture the credential exchange"
       ],
       "answer": 3,
       "explain": "Server validation protects the inner credentials. The shared secret, VLAN assignment and accounting are unrelated to client-side validation."
      },
      {
       "q": "What advantage does TEAP offer over PEAP?",
       "options": [
        "It chains machine and user authentication",
        "It removes the need for any server certificate on the RADIUS server",
        "It works without a RADIUS server",
        "It uses the MAC address as a second factor"
       ],
       "answer": 0,
       "explain": "TEAP supports credential chaining of device and user. It still uses a server certificate and RADIUS, and does not use MACs as factors."
      }
     ]
    }
   ]
  },
  {
   "id": "m4-l3",
   "title": "MAB, Dynamic Authorisation and Phased Deployment",
   "subtitle": "Handle devices without supplicants, push per-session policy, and roll out NAC without outages",
   "minutes": 32,
   "objectives": [
    "Configure 802.1X with MAB fallback on an access switch",
    "Assign dynamic VLANs, ACLs and downloadable ACLs from the NAC server",
    "Use change of authorisation to update sessions in real time",
    "Plan monitor, low-impact and closed deployment phases"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Printers, cameras, badge readers and medical devices often cannot run a supplicant. **MAC Authentication Bypass (MAB)** lets the switch send the device's MAC address to the NAC server as its identity. It is convenient — and weak, because MAC addresses are easily spoofed. Treat MAB sessions as low-trust and authorise them narrowly."
    },
    {
     "type": "compare",
     "title": "802.1X versus MAB",
     "columns": [
      {
       "title": "802.1X",
       "items": [
        "Cryptographic credential (certificate or password)",
        "Strong identity of user and/or device",
        "Needs a supplicant and configuration",
        "Suitable for full corporate access"
       ]
      },
      {
       "title": "MAB",
       "items": [
        "MAC address only",
        "Easily spoofed; strengthen with profiling",
        "Works for any device that sends traffic",
        "Use narrow, device-type-specific authorisation"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Global AAA and RADIUS for NAC",
     "device": "SW-ACC-07 · IOS-style CLI",
     "lines": [
      "aaa new-model",
      "radius server NAC-1",
      " address ipv4 10.250.0.10 auth-port 1812 acct-port 1813",
      " key <unique-secret-from-vault>",
      "aaa group server radius NAC-SERVERS",
      " server name NAC-1",
      "aaa authentication dot1x default group NAC-SERVERS",
      "aaa authorization network default group NAC-SERVERS",
      "aaa accounting dot1x default start-stop group NAC-SERVERS",
      "aaa server radius dynamic-author",
      " client 10.250.0.10 server-key <unique-secret-from-vault>",
      "radius-server vsa send authentication",
      "dot1x system-auth-control"
     ],
     "note": "`aaa server radius dynamic-author` lets the NAC server send change-of-authorisation requests (RFC 5176) to the switch."
    },
    {
     "type": "cli",
     "title": "Access port: 802.1X first, MAB fallback, low-impact mode",
     "device": "SW-ACC-07 · IOS-style CLI",
     "lines": [
      "ip access-list extended PRE-AUTH",
      " permit udp any any eq bootps",
      " permit udp any any eq domain",
      " deny ip any any",
      "interface GigabitEthernet1/0/10",
      " switchport mode access",
      " switchport access vlan 20",
      " ip access-group PRE-AUTH in",
      " authentication host-mode multi-auth",
      " authentication order dot1x mab",
      " authentication priority dot1x mab",
      " authentication port-control auto",
      " authentication open",
      " mab",
      " dot1x pae authenticator",
      " dot1x timeout tx-period 10",
      " spanning-tree portfast"
     ],
     "note": "`authentication open` with a pre-auth ACL is low-impact mode: only DHCP and DNS pass before authorisation. Remove `authentication open` for closed mode."
    },
    {
     "type": "table",
     "title": "Authorisation results the NAC server can return",
     "head": [
      "Result",
      "How it is signalled",
      "Use"
     ],
     "rows": [
      [
       "Dynamic VLAN",
       "Tunnel-Type = VLAN (13), Tunnel-Medium-Type = 802 (6), Tunnel-Private-Group-ID = VLAN",
       "Place devices into the right segment"
      ],
      [
       "Named ACL",
       "Filter-Id = name of an ACL pre-configured on the switch",
       "Apply consistent per-role filtering"
      ],
      [
       "Downloadable ACL",
       "Vendor-specific attributes; switch downloads ACL entries from the server",
       "Central policy without touching each switch"
      ],
      [
       "Group tag",
       "Vendor-specific attribute carrying a numeric group identifier",
       "Identity-based segmentation independent of IP"
      ],
      [
       "Session timeout / reauthentication",
       "Session-Timeout and Termination-Action",
       "Force periodic re-evaluation"
      ],
      [
       "URL redirect",
       "Vendor-specific redirect URL and ACL",
       "Guest portal, posture or onboarding"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Verifying the session on the switch",
     "device": "SW-ACC-07 · IOS-style CLI",
     "lines": [
      "SW-ACC-07# show authentication sessions interface Gi1/0/10 details",
      "            Interface:  GigabitEthernet1/0/10",
      "          MAC Address:  3c22.fb10.4a7e",
      "            User-Name:  host/LT-0457.corp.example",
      "               Status:  Authorized",
      "       Oper host mode:  multi-auth",
      "      Server Policies:",
      "           Vlan Group:  Vlan: 20",
      "     Downloaded ACL:  DACL-IP-EMPLOYEE-6631a1b2",
      "  Method status list:",
      "       dot1x            Authc Success",
      "       mab              Not run"
     ],
     "note": "The downloadable ACL name and VLAN confirm that the NAC server's authorisation was applied."
    },
    {
     "type": "sequence",
     "title": "Change of authorisation (CoA) in action",
     "caption": "The NAC server, not the endpoint, starts the change: it tells the switch to re-run authorisation, and the new decision restricts the laptop within seconds, without a site visit or a cable pull.",
     "actors": [
      "EDR platform",
      "NAC server",
      "Access switch"
     ],
     "steps": [
      {
       "from": 0,
       "to": 1,
       "label": "Alert: malware on LT-0457",
       "note": "API or syslog integration"
      },
      {
       "from": 1,
       "to": 2,
       "label": "CoA-Request: reauthenticate session",
       "note": "UDP 3799 (RFC 5176)"
      },
      {
       "from": 2,
       "to": 1,
       "label": "CoA-ACK",
       "reply": true
      },
      {
       "from": 2,
       "to": 1,
       "label": "Access-Request (reauthentication)"
      },
      {
       "from": 1,
       "to": 1,
       "label": "Policy now matches QUARANTINE"
      },
      {
       "from": 2,
       "to": 1,
       "label": "Access-Accept: QUARANTINE dACL",
       "reply": true
      },
      {
       "from": 2,
       "to": 2,
       "label": "Apply dACL: remediation servers only"
      }
     ]
    },
    {
     "type": "table",
     "title": "Phased deployment",
     "head": [
      "Phase",
      "Port behaviour",
      "Goal",
      "Exit criterion"
     ],
     "rows": [
      [
       "Monitor (open)",
       "All traffic allowed; authentication logged",
       "Find every device and failure without impact",
       "95%+ of sessions authenticate as expected"
      ],
      [
       "Low-impact",
       "Pre-auth ACL limits traffic before authorisation",
       "Enforce for known devices, minimal risk",
       "Unknown devices identified and profiled"
      ],
      [
       "Closed",
       "Only EAPOL until authorised",
       "Full enforcement",
       "Ongoing operations with exception process"
      ]
     ]
    },
    {
     "type": "scenario",
     "title": "Monitor mode surprises",
     "situation": "After two weeks in monitor mode on a hospital floor, logs show 300 MAB attempts from infusion pumps and patient monitors that fail authentication because their MACs are not in the NAC database.",
     "options": [
      {
       "text": "Move to closed mode now so unregistered devices are blocked",
       "feedback": "This would disconnect patient-care equipment — a safety incident, not a security win.",
       "best": false
      },
      {
       "text": "Profile and register the medical devices, create a narrow device-type policy for them, and only then move the floor to low-impact mode",
       "feedback": "Correct. Monitor mode exists to find exactly this; enforcing before fixing would disconnect clinical devices.",
       "best": true
      },
      {
       "text": "Disable NAC on the medical-device floor permanently",
       "feedback": "This leaves the area uncontrolled; the right fix is registration and narrow policy.",
       "best": false
      },
      {
       "text": "Configure the switch to accept any MAC address that fails MAB",
       "feedback": "This removes the control entirely while still looking enforced.",
       "best": false
      }
     ]
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "MAB is a weak, MAC-based identity: profile devices and give them narrow, device-type policy.",
      "The NAC server returns VLANs, named or downloadable ACLs, tags, timers and redirects as RADIUS attributes.",
      "CoA lets the NAC server change an active session immediately when posture or threat signals change.",
      "Roll out in phases (monitor, low-impact, closed) and leave each phase only when its exit criterion is met."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Why should MAB sessions receive narrow authorisation?",
       "options": [
        "Because MAB sessions cannot be assigned to any VLAN other than the default",
        "Because MAB uses an unencrypted EAP method",
        "Because MAC addresses are easily spoofed",
        "Because MAB requires a supplicant on the device"
       ],
       "answer": 2,
       "explain": "MAB identity is just a MAC address. MAB can assign VLANs, does not use EAP methods and exists precisely for devices without supplicants."
      },
      {
       "q": "Which RADIUS attributes assign a dynamic VLAN?",
       "options": [
        "Filter-Id, Session-Timeout and Class",
        "NAS-IP-Address, NAS-Port, NAS-Port-Type and Called-Station-Id",
        "Tunnel-Type, Tunnel-Medium-Type and Tunnel-Private-Group-ID together",
        "Framed-IP-Address, Framed-MTU and Idle-Timeout"
       ],
       "answer": 2,
       "explain": "The three Tunnel attributes signal VLAN assignment. Filter-Id applies a named ACL; NAS and Framed attributes describe the session."
      },
      {
       "q": "What does `authentication open` with a pre-auth ACL achieve?",
       "options": [
        "Low-impact mode: DHCP and DNS only before auth",
        "Closed mode: only EAPOL frames are accepted on the port before authorisation",
        "MAB is disabled so only 802.1X is attempted",
        "Accounting is disabled until the session is authorised"
       ],
       "answer": 0,
       "explain": "Open authentication plus a restrictive ACL is the low-impact model. Closed mode removes `authentication open`."
      },
      {
       "q": "An EDR platform reports malware on an authorised laptop. Which mechanism lets NAC restrict it immediately?",
       "options": [
        "A new DHCP lease forced by the laptop's operating system",
        "An SNMP trap sent from the access switch to the NAC server for that port",
        "A periodic reauthentication timer expiring after eight hours",
        "A change-of-authorisation request sent by the NAC server"
       ],
       "answer": 3,
       "explain": "CoA (RFC 5176) lets the server push a new policy now. DHCP renewals and timers are not immediate; SNMP traps go the other direction."
      },
      {
       "q": "What is the main purpose of monitor mode?",
       "options": [
        "To enforce access only for guest devices",
        "To find problems before enforcing",
        "To collect user credentials so they can be migrated into the new directory",
        "To test switch hardware performance under load"
       ],
       "answer": 1,
       "explain": "Monitor mode logs results without blocking, so problems are fixed before enforcement."
      }
     ]
    }
   ]
  },
  {
   "id": "m4-l4",
   "title": "Posture, Guest and BYOD Onboarding",
   "subtitle": "Check device health before access, and give guests and personal devices safe, convenient paths",
   "minutes": 28,
   "objectives": [
    "Design posture policies with compliant, non-compliant and unknown states",
    "Build guest access flows with isolation and accountability",
    "Onboard personal devices with certificates instead of shared passwords",
    "Write a NAC policy matrix covering users, devices and conditions"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Authentication answers *who*; **posture** answers *is this device healthy enough?* Posture assessment checks conditions such as operating-system patch level, disk encryption, firewall state and endpoint-protection health before granting full access — and re-checks them over time."
    },
    {
     "type": "flow",
     "title": "Posture flow",
     "items": [
      {
       "label": "Authenticate",
       "text": "Device passes 802.1X; posture status is unknown"
      },
      {
       "label": "Limited access",
       "text": "Redirect or restricted ACL lets the agent reach the posture service"
      },
      {
       "label": "Assess",
       "text": "Agent (or MDM/EDR integration) reports patch, encryption and protection state"
      },
      {
       "label": "Decide",
       "text": "Compliant, non-compliant or still unknown after a timeout"
      },
      {
       "label": "CoA",
       "text": "Server updates the session to full, remediation or restricted access"
      }
     ]
    },
    {
     "type": "table",
     "title": "Posture states and outcomes",
     "head": [
      "State",
      "Typical cause",
      "Access granted"
     ],
     "rows": [
      [
       "Compliant",
       "All checks passed",
       "Role-based access"
      ],
      [
       "Non-compliant",
       "Missing patches, encryption off, EDR unhealthy",
       "Remediation servers only, with user notification"
      ],
      [
       "Unknown",
       "No agent, agent cannot report, unmanaged device",
       "Internet-only or guest-like access"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "Agent-based posture is precise but adds software. Many organisations combine **MDM compliance** for mobile devices and **EDR health** for laptops, fed to the NAC server through APIs. Whatever the source, define what happens when the signal is missing — 'unknown' must not quietly mean 'compliant'.",
     "title": "Use signals you already have"
    },
    {
     "type": "compare",
     "title": "Guest access models",
     "columns": [
      {
       "title": "Self-registration",
       "items": [
        "Guest enters details on a portal; credentials sent by SMS or email",
        "Low friction for visitors",
        "Accountability via verified contact"
       ]
      },
      {
       "title": "Sponsored",
       "items": [
        "An employee creates or approves the guest account",
        "Clear accountability",
        "Good for contractors and longer stays"
       ]
      },
      {
       "title": "Hotspot (accept terms)",
       "items": [
        "No identity, only acceptance of terms",
        "Least friction",
        "Least accountability; isolate strictly"
       ]
      }
     ]
    },
    {
     "type": "keypoints",
     "items": [
      "Separate SSID or VLAN with internet-only access; no routes to internal networks",
      "Client isolation so guests cannot reach each other",
      "Use encryption even on open networks (Opportunistic Wireless Encryption, 'Enhanced Open')",
      "Rate limits and content filtering according to policy",
      "Log associations and DHCP leases for accountability under local law",
      "Expire accounts automatically"
     ],
     "title": "Guest network design rules"
    },
    {
     "type": "topology",
     "title": "One access layer, three trust levels",
     "caption": "All three SSIDs share the same access points, but each lands in a different segment: managed laptops reach internal apps, onboarded personal phones reach only approved apps, and guests are carried in their own VRF straight to the internet edge.",
     "nodes": [
      {
       "id": "nac",
       "kind": "controller",
       "label": "NAC / RADIUS",
       "sub": "10.250.0.10",
       "x": 3,
       "y": 0
      },
      {
       "id": "inet",
       "kind": "internet",
       "label": "Internet",
       "x": 6,
       "y": 0
      },
      {
       "id": "srv",
       "kind": "server",
       "label": "Internal apps",
       "sub": "10.20.0.0/16",
       "x": 0,
       "y": 2
      },
      {
       "id": "core",
       "kind": "l3switch",
       "label": "Core + WLC",
       "sub": "VRFs, CoA client",
       "x": 3,
       "y": 2
      },
      {
       "id": "fw",
       "kind": "firewall",
       "label": "Edge firewall",
       "sub": "guest: internet only",
       "x": 6,
       "y": 2
      },
      {
       "id": "ap",
       "kind": "ap",
       "label": "Access point",
       "sub": "SSIDs CORP, BYOD, GUEST",
       "x": 3,
       "y": 4
      },
      {
       "id": "corp",
       "kind": "laptop",
       "label": "Corp laptop",
       "sub": "EAP-TLS → VLAN 20",
       "x": 1,
       "y": 6
      },
      {
       "id": "byod",
       "kind": "phone",
       "label": "BYOD phone",
       "sub": "onboarded cert → VLAN 30",
       "x": 3,
       "y": 6
      },
      {
       "id": "gst",
       "kind": "laptop",
       "label": "Guest",
       "sub": "OWE → VLAN 90",
       "x": 5,
       "y": 6
      }
     ],
     "links": [
      {
       "a": "nac",
       "b": "core",
       "label": "RADIUS",
       "style": "dashed"
      },
      {
       "a": "core",
       "b": "srv",
       "label": "corp; BYOD apps only"
      },
      {
       "a": "core",
       "b": "fw",
       "label": "VLAN 90 in guest VRF"
      },
      {
       "a": "fw",
       "b": "inet"
      },
      {
       "a": "core",
       "b": "ap",
       "label": "trunk"
      },
      {
       "a": "ap",
       "b": "corp",
       "style": "wireless"
      },
      {
       "a": "ap",
       "b": "byod",
       "style": "wireless"
      },
      {
       "a": "ap",
       "b": "gst",
       "style": "wireless"
      }
     ],
     "zones": [
      {
       "label": "Guest VRF",
       "x": 5,
       "y": 6,
       "w": 1,
       "h": 1,
       "tone": "bad"
      }
     ]
    },
    {
     "type": "flow",
     "title": "BYOD onboarding",
     "items": [
      {
       "label": "Connect to onboarding SSID",
       "text": "Restricted access to the onboarding portal only"
      },
      {
       "label": "Authenticate user",
       "text": "Corporate credentials with MFA"
      },
      {
       "label": "Register device",
       "text": "Device is linked to the user; MDM enrolment if required"
      },
      {
       "label": "Provision",
       "text": "Portal installs a certificate (for example via SCEP) and a Wi-Fi profile pinning the server"
      },
      {
       "label": "Reconnect",
       "text": "Device joins the secure SSID with EAP-TLS and receives a BYOD role"
      }
     ]
    },
    {
     "type": "template",
     "title": "NAC policy matrix",
     "purpose": "Define, for each combination of identity, device type and condition, the exact authorisation result.",
     "columns": [
      "Who / what",
      "Device type",
      "Auth method",
      "Posture / condition",
      "Authorisation result",
      "Segment / tag"
     ],
     "example": [
      [
       "Employee",
       "Corporate laptop",
       "EAP-TLS (machine + user)",
       "Compliant",
       "VLAN 20, EMPLOYEE dACL",
       "Tag EMP"
      ],
      [
       "Employee",
       "Personal phone (BYOD)",
       "EAP-TLS (onboarded cert)",
       "MDM compliant",
       "Internet + email and collaboration apps only",
       "Tag BYOD"
      ]
     ],
     "rows": 8
    },
    {
     "type": "case",
     "title": "University Wi-Fi 802.1X rollout",
     "context": "A university with 25,000 students and 3,000 staff runs a single PEAP SSID using directory passwords. Students configure devices themselves; many accept any server certificate. Credential phishing of student accounts is rising, and shared accounts are used to reach lab systems. The IT team wants stronger security without overwhelming the help desk at the start of term.",
     "questions": [
      "What target design would you propose?",
      "How would you onboard 25,000 personal devices without a help-desk crisis?",
      "How should labs, IoT and guest traffic be handled?",
      "How would you phase the migration?"
     ],
     "answer": "**Target design:** EAP-TLS for staff managed devices via automatic certificate enrolment; for students, a self-service onboarding portal (with MFA) that installs a per-device certificate and a profile pinning the RADIUS server name and CA. Role-based authorisation returns student, staff, researcher and contractor roles with different ACLs or group tags. **Onboarding at scale:** open the portal weeks before term, publish short guides per operating system, staff 'onboarding desks' in the first week and keep PEAP with enforced server validation as a time-limited fallback. **Other traffic:** a separate guest SSID with Enhanced Open and internet-only access; lab systems reachable only by authorised groups; IoT devices on MAB with profiling and narrow device-type policies in their own segments. **Phasing:** monitor and pilot with IT staff, then staff, then new students at the start of term, then remaining students; retire the legacy PEAP SSID on a published date. Measure success by onboarding completion, help-desk tickets and reduction in compromised accounts."
    },
    {
     "type": "scenario",
     "title": "Unknown posture",
     "situation": "The NAC server cannot reach the MDM platform due to an API outage. All mobile devices now return posture 'unknown'. The policy maps 'unknown' to internet-only, and executives complain that email on phones has stopped.",
     "options": [
      {
       "text": "Change the policy permanently so 'unknown' is treated as compliant",
       "feedback": "This fails open for every future outage and every unmanaged device.",
       "best": false
      },
      {
       "text": "Disable NAC for all mobile devices until further notice",
       "feedback": "Removes control broadly to solve a temporary integration fault.",
       "best": false
      },
      {
       "text": "Keep the policy, restore the API integration urgently, and consider a documented, time-limited exception for email access only",
       "feedback": "Best. The policy behaves as designed; fix the dependency and grant a narrow, temporary exception if the business needs it.",
       "best": true
      }
     ]
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "Posture answers whether a device is healthy enough; re-check it over time, not only at connect.",
      "'Unknown' posture must never mean full access; fix integrations instead of failing open.",
      "Guests get internet-only access, client isolation, OWE encryption, logging and automatic expiry.",
      "Onboard BYOD with a certificate and a pinned Wi-Fi profile, then authorise a narrow BYOD role."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "What should a posture state of 'unknown' normally lead to?",
       "options": [
        "Limited access, such as internet-only, never full access",
        "Full access, because the device has already passed 802.1X authentication",
        "Immediate disconnection and permanent blocking of the device",
        "Automatic reclassification as compliant after one minute"
       ],
       "answer": 0,
       "explain": "Unknown means health cannot be confirmed. Granting full access fails open; blocking permanently is excessive."
      },
      {
       "q": "Which mechanism moves a device from restricted to full access after it passes posture?",
       "options": [
        "The user unplugging and re-plugging the cable",
        "A DHCP lease renewal on the client",
        "Change of authorisation (CoA)",
        "A spanning-tree topology change"
       ],
       "answer": 2,
       "explain": "CoA updates the session in place. Re-plugging may work but is not the design; DHCP and spanning tree are unrelated."
      },
      {
       "q": "Why does BYOD onboarding install a certificate and a Wi-Fi profile?",
       "options": [
        "So the device can bypass MFA on all future corporate application logins",
        "So the device can use EAP-TLS and automatically validate the RADIUS server",
        "So the user's directory password is stored in the profile for convenience",
        "So the device can join the guest network without terms"
       ],
       "answer": 1,
       "explain": "Certificates remove passwords from Wi-Fi authentication and the profile enforces server validation. Storing passwords or bypassing MFA weakens security."
      },
      {
       "q": "What does Opportunistic Wireless Encryption add to an open guest network?",
       "options": [
        "User authentication against the corporate directory service",
        "Automatic posture checks for guest devices",
        "Content filtering of guest web traffic",
        "Per-client over-the-air encryption without a password"
       ],
       "answer": 3,
       "explain": "OWE (Enhanced Open) encrypts traffic on open networks. It does not authenticate users, check posture or filter content."
      },
      {
       "q": "A sponsored guest model is best suited when:",
       "options": [
        "Thousands of anonymous visitors need instant access at a stadium event",
        "Accountability matters, as for long-stay contractors",
        "No employee is available to approve requests",
        "Guests must reach internal servers without restrictions"
       ],
       "answer": 1,
       "explain": "Sponsorship ties each guest to an employee. Anonymous high-volume access suits hotspot or self-registration; guests should never get unrestricted internal access."
      }
     ]
    }
   ]
  },
  {
   "id": "m4-l5",
   "title": "MFA, Phishing-Resistant Authentication and Identity-Based Segmentation",
   "subtitle": "Make credentials hard to steal and use identity, not IP addresses, to decide what talks to what",
   "minutes": 30,
   "objectives": [
    "Distinguish phishable from phishing-resistant authenticators",
    "Apply MFA to VPN, device administration and privileged access",
    "Design group-based segmentation with tags and a policy matrix",
    "Connect identity controls to zero-trust architecture"
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Attackers rarely break cryptography — they log in. Stolen passwords, intercepted one-time codes and users tricked into approving push prompts are behind a large share of intrusions. **Multi-factor authentication (MFA)** is essential, but not all MFA is equal."
    },
    {
     "type": "table",
     "title": "Authenticator strength",
     "head": [
      "Authenticator",
      "Phishing resistant?",
      "Main weakness",
      "Use"
     ],
     "rows": [
      [
       "Password only",
       "No",
       "Phished, reused, sprayed",
       "Never alone for remote or privileged access"
      ],
      [
       "SMS or voice one-time code",
       "No",
       "SIM swap, interception, real-time relay",
       "Legacy fallback only"
      ],
      [
       "Authenticator-app one-time code",
       "No",
       "Real-time relay through a fake login page",
       "Better than SMS, still phishable"
      ],
      [
       "Push approval with number matching",
       "No (reduced fatigue risk)",
       "Relay attacks still possible",
       "Acceptable interim step"
      ],
      [
       "Passkey or FIDO2 security key (WebAuthn)",
       "Yes",
       "Recovery and enrolment processes; synced passkeys inherit the security of the sync account, so use device-bound keys for admins",
       "Preferred for all users"
      ],
      [
       "Smart card / certificate (PKI-based)",
       "Yes",
       "Card and certificate management overhead",
       "Privileged and high-assurance users"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "An authenticator is **phishing resistant** when it cryptographically binds the login to the genuine service, so credentials captured by a fake site are useless. FIDO2/WebAuthn achieves this by tying each key pair to the legitimate origin; certificate-based mutual TLS achieves it by proving possession of a private key to a verified server. NIST's digital identity guidelines (SP 800-63B, revision 4 finalised in 2025) describe this property and accept syncable passkeys at moderate assurance, with device-bound authenticators for the highest assurance.",
     "title": "Phishing resistance"
    },
    {
     "type": "sequence",
     "title": "Why a passkey cannot be phished",
     "caption": "The authenticator signs the challenge together with the origin the browser actually visited. A look-alike site has a different origin, so no matching credential exists and nothing replayable is produced.",
     "actors": [
      "User + authenticator",
      "Browser",
      "Identity provider"
     ],
     "steps": [
      {
       "from": 1,
       "to": 2,
       "label": "Sign-in to login.corp.example"
      },
      {
       "from": 2,
       "to": 1,
       "label": "Challenge + relying-party ID",
       "reply": true
      },
      {
       "from": 1,
       "to": 0,
       "label": "Request for this origin only",
       "note": "browser supplies the real origin"
      },
      {
       "from": 0,
       "to": 0,
       "label": "User verification (PIN or biometric)"
      },
      {
       "from": 0,
       "to": 1,
       "label": "Signature over challenge + origin",
       "note": "private key never leaves",
       "reply": true
      },
      {
       "from": 1,
       "to": 2,
       "label": "Signed assertion"
      },
      {
       "from": 2,
       "to": 2,
       "label": "Verify with stored public key"
      },
      {
       "from": 2,
       "to": 1,
       "label": "Session established",
       "reply": true
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Attackers bombard users with push prompts until one is approved, or call the help desk pretending to be a user who lost a phone. Use number matching, limit prompt rates, alert on repeated denials and require strong identity verification before any MFA reset.",
     "title": "MFA fatigue and helpdesk social engineering"
    },
    {
     "type": "callout",
     "kind": "pro",
     "title": "Identity threat detection and response (ITDR)",
     "text": "Phishing-resistant MFA protects the sign-in, but attackers now steal what comes after it: session cookies and refresh tokens lifted by infostealer malware, rogue OAuth consent grants and new MFA methods added to a hijacked account. Treat the identity provider as a monitored system: alert on token reuse from a new device or network, impossible travel, MFA-method and admin-role changes and unusual consent grants. Response playbooks must **revoke sessions and refresh tokens**, not just reset passwords, and short token lifetimes, device-bound sessions and continuous access evaluation reduce the value of anything stolen."
    },
    {
     "type": "keypoints",
     "items": [
      "Remote-access VPN and ZTNA portals — preferably phishing-resistant",
      "Device administration through TACACS+ or a privileged access gateway",
      "Firewall, NAC, SIEM and cloud management consoles",
      "Jump hosts and bastions for data-centre and OT access",
      "Break-glass account use through dual control rather than shared passwords"
     ],
     "title": "Where network teams must enforce MFA"
    },
    {
     "type": "text",
     "text": "**Identity-based segmentation** assigns each user or device a group identifier (a tag) at authentication time. Enforcement points then apply a **group-to-group policy matrix**, independent of IP address or VLAN. When a user moves from Wi-Fi to wired, or from one building to another, the policy follows the identity."
    },
    {
     "type": "layers",
     "title": "Group-based policy architecture",
     "items": [
      {
       "label": "Policy",
       "parts": [
        "Group-to-group matrix defined centrally on the NAC server",
        "Owned by security architecture"
       ]
      },
      {
       "label": "Classification",
       "parts": [
        "Tag assigned at 802.1X/MAB authorisation",
        "Static tags for servers and subnets"
       ]
      },
      {
       "label": "Propagation",
       "parts": [
        "Carried inline in frame or overlay headers where supported",
        "Or shared as IP-to-tag mappings with enforcement points"
       ]
      },
      {
       "label": "Enforcement",
       "parts": [
        "Group ACLs on switches",
        "Tag-aware firewall rules"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Example group policy matrix",
     "head": [
      "Source group ↓ / Destination →",
      "Finance servers",
      "HR servers",
      "Printers",
      "Internet"
     ],
     "rows": [
      [
       "Finance staff",
       "Permit HTTPS",
       "Deny",
       "Permit print",
       "Permit"
      ],
      [
       "HR staff",
       "Deny",
       "Permit HTTPS",
       "Permit print",
       "Permit"
      ],
      [
       "Contractors",
       "Deny",
       "Deny",
       "Deny",
       "Permit web"
      ],
      [
       "IoT cameras",
       "Deny",
       "Deny",
       "Deny",
       "Permit to video cloud only"
      ],
      [
       "Quarantine",
       "Deny",
       "Deny",
       "Deny",
       "Remediation only"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Identity-based segmentation only works if identities are trustworthy. Weak MAB entries, PEAP without server validation or shared accounts let attackers inherit the wrong tag. Strong authentication (module 4) and segmentation (module 1) depend on each other — and both feed the zero-trust wrapper covered in module 8.",
     "title": "Identity is the new perimeter — and it needs depth too"
    },
    {
     "type": "scenario",
     "title": "Push-bombing attempt",
     "situation": "The SOC sees 27 denied VPN push prompts for a finance user within 10 minutes from an overseas IP, then one approval. A VPN session is now active.",
     "options": [
      {
       "text": "Terminate the session, disable the account's sessions and tokens, contact the user out of band, and move the user to phishing-resistant MFA",
       "feedback": "Correct. The approval after repeated denials is a classic fatigue compromise; contain first, then fix the authenticator weakness.",
       "best": true
      },
      {
       "text": "Leave the session up and monitor it to gather intelligence",
       "feedback": "Observing an active attacker on a finance account risks data loss; containment comes first unless a formal decision says otherwise.",
       "best": false
      },
      {
       "text": "Reset the user's password and close the ticket",
       "feedback": "The active session and any issued tokens may survive a password change.",
       "best": false
      },
      {
       "text": "Block the overseas country at the VPN gateway and take no further action",
       "feedback": "Geo-blocking can be bypassed with a local proxy and leaves the compromised session untouched.",
       "best": false
      }
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "AAA",
       "def": "Authentication, authorisation and accounting: the framework for controlling and recording access."
      },
      {
       "term": "RADIUS",
       "def": "A UDP-based AAA protocol (RFC 2865) used mainly for network access, including 802.1X."
      },
      {
       "term": "TACACS+",
       "def": "A TCP-based AAA protocol (RFC 8907) that separates authentication, authorisation and accounting; used for device administration."
      },
      {
       "term": "Supplicant",
       "def": "The endpoint software that presents credentials in 802.1X."
      },
      {
       "term": "Authenticator",
       "def": "The switch or wireless controller that controls the port and relays EAP to the authentication server."
      },
      {
       "term": "EAP-TLS",
       "def": "An EAP method using certificates on both client and server for mutual authentication."
      },
      {
       "term": "PEAP",
       "def": "An EAP method that builds a TLS tunnel with a server certificate and carries an inner, usually password-based, method."
      },
      {
       "term": "MAB",
       "def": "MAC Authentication Bypass: using a device's MAC address as its identity when it cannot run 802.1X."
      },
      {
       "term": "Change of authorisation (CoA)",
       "def": "A RADIUS extension (RFC 5176) that lets the server change or end an active session."
      },
      {
       "term": "Downloadable ACL",
       "def": "An access list defined on the NAC server and pushed to the switch for a specific session."
      },
      {
       "term": "Posture assessment",
       "def": "Checking an endpoint's security state before and during network access."
      },
      {
       "term": "Phishing-resistant MFA",
       "def": "Authentication that cryptographically binds to the genuine service so captured credentials cannot be replayed."
      },
      {
       "term": "Group tag",
       "def": "A numeric identifier assigned at authentication and used to enforce group-to-group policy."
      }
     ]
    },
    {
     "type": "checklist",
     "title": "Identity layer readiness checklist",
     "items": [
      "Device administration uses named TACACS+ accounts with command accounting",
      "RADIUS servers and clients are patched and require Message-Authenticator",
      "802.1X supplicant profiles pin the trusted CA and server name",
      "EAP-TLS migration plan exists for managed devices",
      "MAB devices are profiled and receive device-type-specific policy",
      "CoA is configured and tested on every access switch",
      "Posture 'unknown' never maps to full access",
      "Phishing-resistant MFA protects VPN and privileged access",
      "Group policy matrix is owned, reviewed and logged"
     ]
    },
    {
     "type": "reflection",
     "prompt": "Which group of users in your organisation would gain the most from moving to phishing-resistant MFA first, and what is the biggest obstacle?"
    },
    {
     "type": "keypoints",
     "title": "Key takeaways",
     "items": [
      "Most intrusions log in rather than break in: protect every remote, admin and console login with MFA.",
      "Only origin-bound authenticators (passkeys, FIDO2 keys, certificates) are phishing resistant; codes and pushes can be relayed.",
      "Defend the help desk and the session: verify identity before MFA resets and revoke tokens during response.",
      "Identity-based segmentation applies a group-to-group matrix that follows the user, but only if identities are strong."
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Which authenticator is phishing resistant?",
       "options": [
        "A time-based one-time code from a mobile authenticator app",
        "A push approval with number matching",
        "A one-time code sent by SMS",
        "A FIDO2 key bound to the origin"
       ],
       "answer": 3,
       "explain": "FIDO2 binds credentials to the real origin, so fake sites cannot use them. Codes and push approvals can be relayed in real time."
      },
      {
       "q": "What is the main defence against MFA fatigue attacks?",
       "options": [
        "Number matching, prompt rate limits and alerts on repeated denials",
        "Shortening the password expiry period for every remote-access user",
        "Sending each push prompt to two of the user's devices at once",
        "Allowing SMS as a fallback when push fails"
       ],
       "answer": 0,
       "explain": "These controls stop blind approvals and flag the attack. Password expiry and SMS fallback do not address push bombing; two devices doubles exposure."
      },
      {
       "q": "In identity-based segmentation, when is the group tag usually assigned?",
       "options": [
        "When the DHCP server assigns the device its first IP address lease",
        "When the firewall first sees the device's traffic",
        "At authorisation time, by the NAC server after 802.1X",
        "Manually by an engineer on each switch port"
       ],
       "answer": 2,
       "explain": "The NAC server returns the tag in the authorisation result. DHCP and the firewall do not classify identity; manual port tagging defeats the purpose."
      },
      {
       "q": "Why does identity-based policy follow a user who moves from Wi-Fi to a wired port?",
       "options": [
        "The user keeps the same IP address in every building and on every network",
        "Wired and wireless traffic share one physical switch",
        "The policy follows the user's group tag, not a VLAN or IP address",
        "Firewalls cache the user's last known MAC address for the day"
       ],
       "answer": 2,
       "explain": "Tags are assigned per session from identity, so policy is location-independent. IP, hardware and MAC caching are not the mechanism."
      },
      {
       "q": "A strong group policy matrix is undermined most by which weakness?",
       "options": [
        "Weak identities, such as unprofiled MAB entries",
        "Using numeric rather than human-readable named group identifiers in the matrix",
        "Placing printers in their own group",
        "Logging matrix denies to the SIEM"
       ],
       "answer": 0,
       "explain": "If identity can be spoofed or stolen, an attacker inherits a valid tag. Numeric IDs, printer groups and logging are normal good practice."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.exam.push([
 {
  "module": "m1",
  "q": "A threat-intelligence feed reports that a crime group is mass-exploiting a flaw in the remote-access portal model your company runs. Your patch is scheduled for next week's maintenance window. What should the security architect do FIRST?",
  "options": [
   "Keep the scheduled window but raise the portal's logging level to debug until then",
   "Add a second-factor prompt to the portal login and leave the patch on its current schedule",
   "Patch or mitigate now as an emergency change, then hunt for signs of prior compromise",
   "Move the portal to a new public IP address so automated scanners lose track of it"
  ],
  "answer": 2,
  "explain": "Active exploitation of an internet-facing device is high likelihood and high impact. Patching closes the hole and hunting addresses earlier compromise. Logging, MFA and IP changes do not remove the vulnerability."
 },
 {
  "module": "m1",
  "q": "During an incident review, investigators find the attacker authenticated to a branch file server using a help-desk account, then used the same credentials to reach a headquarters database. Which ATT&CK tactic does the second step represent, and which control would most directly have limited it?",
  "options": [
   "Lateral Movement; segmentation plus tiered admin accounts that cannot cross zones",
   "Initial Access; a stricter perimeter firewall policy on the internet edge routers",
   "Exfiltration; data-loss prevention rules on outbound web traffic to the internet",
   "Reconnaissance; hiding server names from internal DNS so they cannot be discovered"
  ],
  "answer": 0,
  "explain": "Moving between internal systems with stolen credentials is Lateral Movement; segmentation and admin tiering limit it. The other tactics occur at different stages and their controls do not address internal credential reuse."
 },
 {
  "module": "m1",
  "q": "A risk register lists: (A) likelihood 5, impact 2; (B) likelihood 2, impact 5; (C) likelihood 4, impact 4; (D) likelihood 3, impact 3. With qualitative scoring of likelihood × impact, which should the roadmap address first, all else equal?",
  "options": [
   "A, because likelihood 5 is the highest single rating",
   "B, because impact 5 is the highest single rating",
   "D, because balanced risks are the most predictable",
   "C, with a score of 16"
  ],
  "answer": 3,
  "explain": "C scores 16; A and B score 10; D scores 9. The method multiplies both dimensions rather than taking the highest single value."
 },
 {
  "module": "m1",
  "q": "A hospital wants to report its security posture to the board using NIST CSF 2.0 and build a three-year plan. Which approach best uses the framework?",
  "options": [
   "Purchase a product mapped to each of the six functions and report coverage as a percentage",
   "Build current and target profiles and plan the gap by risk, with Govern setting owners",
   "Request formal CSF certification from an accredited auditor before planning any changes",
   "Adopt the highest implementation tier everywhere so that every gap is closed at once"
  ],
  "answer": 1,
  "explain": "CSF is outcome-based; profiles and risk-driven gap plans are its intended use. It does not prescribe products, offers no certification and tiers should match risk rather than being maximised everywhere."
 },
 {
  "module": "m1",
  "q": "An ALE study estimates a ransomware event with SLE 2,000,000 and ARO 0.1. A proposed segmentation project costs 60,000 per year and is expected to reduce ARO to 0.04. What is the expected annual net value of the project?",
  "options": [
   "120,000 per year",
   "60,000 per year",
   "140,000 per year",
   "200,000 per year"
  ],
  "answer": 1,
  "explain": "ALE before = 200,000; after = 80,000; reduction 120,000; minus 60,000 cost = 60,000 net. 120,000 ignores the control cost and 200,000 is the original ALE."
 },
 {
  "module": "m1",
  "q": "A data centre has one large server VLAN. Flow analysis shows only 40 distinct application dependencies between server groups. The team wants the fastest meaningful reduction in ransomware blast radius with low outage risk. Which plan is best?",
  "options": [
   "Deploy host-based micro-segmentation agents on every server with deny-all in one weekend change",
   "Split the servers into more VLANs and keep inter-VLAN routing unfiltered for simplicity",
   "Rely on endpoint protection on the servers and postpone network segmentation until next year",
   "Build macro-segments from the flow data, run permit-and-log first, then enforce deny in waves"
  ],
  "answer": 3,
  "explain": "Evidence-driven macro-segmentation with staged enforcement reduces blast radius quickly and safely. Big-bang micro-segmentation risks outages; VLANs without filtering enforce nothing; relying on one layer is not depth."
 },
 {
  "module": "m1",
  "q": "In a zero-trust design based on NIST SP 800-207, a contractor connects to an internal application through an identity-aware proxy that checks the contractor's identity and device state on every session. Which statement correctly maps the components?",
  "options": [
   "The proxy is the enforcement point; the engine weighing identity and device signals decides",
   "The contractor's laptop is the Policy Decision Point because it holds the credentials",
   "The application server is the Policy Enforcement Point because it is the one that receives the request",
   "The certificate authority is the Policy Engine because it signs the device certificates"
  ],
  "answer": 0,
  "explain": "The proxy sits in the path and enforces; the policy engine and administrator decide. The laptop is the subject, the application is the resource and the CA supplies credentials."
 },
 {
  "module": "m2",
  "q": "A firewall log shows: `action=allow rule=ANY-OUT app=ssl dst=203.0.113.200:443 bytes_out=4.1GB bytes_in=12MB user=unknown` from a server in the database zone at 02:00. What is the MOST significant concern?",
  "options": [
   "The user field is unknown, which shows the identity agent on the firewall needs a restart",
   "The SSL application label means the firewall's signature database is outdated",
   "A database server sending gigabytes out over TLS at night via a catch-all rule",
   "The session used port 443, which should always be blocked from server zones"
  ],
  "answer": 2,
  "explain": "Large outbound volume from a database server via a catch-all rule is a classic exfiltration signal and a policy gap. An unknown user on a server is normal, SSL is a valid classification and port 443 is not inherently malicious."
 },
 {
  "module": "m2",
  "q": "A new rule permitting `App-Team → web01 TCP 8443` has zero hits after a week, yet the team says they use the service daily. The rule is number 140. Rule 37 permits `App-Subnets → DMZ-Servers any`. What is the best action?",
  "options": [
   "Move rule 140 to the top of the policy and leave rule 37 unchanged, since both permit the traffic",
   "Delete rule 140 because zero hits proves the service is no longer used",
   "Enable IPS on rule 140 so that its hit counter starts to increment",
   "Recognise rule 140 as shadowed by rule 37, then narrow or remove rule 37 with its owner"
  ],
  "answer": 3,
  "explain": "Rule 37 matches first, so rule 140 is shadowed. The real problem is the broad rule 37; moving 140 alone keeps the excessive access. Deleting or adding IPS misreads the evidence."
 },
 {
  "module": "m2",
  "q": "After enabling outbound TLS inspection, users reach most sites, but a payroll SaaS provider that requires mutual-TLS client certificates fails for everyone. What is the most appropriate fix?",
  "options": [
   "Import every user's client certificate and private key into the firewall's certificate store",
   "Exempt the payroll provider's destinations from decryption and keep inspecting the rest",
   "Configure the firewall to ignore certificate errors on all decrypted sessions",
   "Disable TLS inspection globally until the payroll provider changes its design"
  ],
  "answer": 1,
  "explain": "A forward proxy cannot present the user's client certificate, so mutual-TLS destinations must bypass decryption. Collecting private keys or ignoring errors creates serious risks; global disablement removes all visibility."
 },
 {
  "module": "m2",
  "q": "A published server at 10.20.0.10 is translated to public 203.0.113.10. A rule permitting `untrust → dmz, destination 10.20.0.10, HTTPS` has no hits, and a deny log shows traffic to 203.0.113.10:443 hitting the default rule. What is the most likely explanation?",
  "options": [
   "The server is not listening on TCP 443 and is resetting every new connection attempt from outside",
   "The static NAT entry is missing, so the traffic never reaches the firewall",
   "Policy here matches the pre-NAT public destination, so the rule must use 203.0.113.10",
   "IPS has blocked the traffic and recorded it as a default-rule deny"
  ],
  "answer": 2,
  "explain": "The deny on the public address shows the rule's destination is not matching; this platform evaluates the original destination. A server reset or IPS block would produce different logs, and traffic clearly reaches the firewall."
 },
 {
  "module": "m2",
  "q": "An active/active firewall pair drops about half of the new TCP sessions to a server farm. Captures show SYNs through FW-A and SYN-ACKs returning through FW-B. What change best solves this?",
  "options": [
   "Make routing symmetric or use session-owner forwarding across the pair",
   "Increase the TCP half-open session timeout on both firewalls so the SYN-ACK has time to arrive",
   "Disable state synchronisation so each unit acts independently",
   "Raise the IPS profile to strict on the server-farm rules"
  ],
  "answer": 0,
  "explain": "FW-B has no session for the SYN-ACK and drops it. Symmetric routing or owner forwarding fixes it. Timeouts, disabling sync and IPS settings do not address asymmetry."
 },
 {
  "module": "m2",
  "q": "During a firewall HA test, both control links are cut. Both units become active and users report intermittent connectivity and duplicate IP warnings. What design change prevents this?",
  "options": [
   "Enable preemption so that the higher-priority unit always wins the active-role election",
   "Reduce the heartbeat interval so failures are detected more quickly",
   "Add a second, physically diverse heartbeat path between the units",
   "Disable configuration synchronisation between the two units"
  ],
  "answer": 2,
  "explain": "This is split-brain; redundant, diverse heartbeat paths prevent it. Preemption and faster heartbeats do not help when the units cannot see each other, and config sync is unrelated."
 },
 {
  "module": "m2",
  "q": "A capture on the firewall's DMZ interface shows: `10.10.4.21 > 10.20.0.15.8443 Flags [S]` followed immediately by `10.20.0.15.8443 > 10.10.4.21 Flags [R.]`. The firewall log shows the session allowed. What should the engineer conclude?",
  "options": [
   "The server itself refused the connection; check its service and host firewall",
   "The firewall injected the reset because an IPS signature matched the first packet of the flow",
   "Asymmetric routing caused the SYN-ACK to return through another device",
   "The TLS inspection policy rejected the server's certificate during the handshake"
  ],
  "answer": 0,
  "explain": "The RST comes from the server's address right after the SYN and the session was allowed, so the server refused it. An IPS reset would appear in threat logs; asymmetry would show no reply; TLS has not started yet."
 },
 {
  "module": "m2",
  "q": "A quarterly audit finds 900 rules with zero hits in 12 months, many with no owner. The business fears outages if they are removed. Which approach best balances risk and availability?",
  "options": [
   "Delete all 900 rules in a single change, because a year of zero hits proves they are unused",
   "Leave the rules in place but add a comment marking them as possibly unused",
   "Convert the 900 rules into a single broad rule so behaviour does not change",
   "Disable them in logged batches, observe, then delete"
  ],
  "answer": 3,
  "explain": "Staged disablement with observation removes risk without surprise outages. Mass deletion risks rare annual flows; commenting changes nothing; merging into a broad rule increases exposure."
 },
 {
  "module": "m3",
  "q": "A site-to-site tunnel log shows: `IKE_SA_INIT received from peer; sending notify NO_PROPOSAL_CHOSEN`. The local side offers AES-GCM-256/PRF-SHA384/DH group 20; the peer offers AES-CBC-256/SHA-256/DH group 14. What is the best resolution?",
  "options": [
   "Change the pre-shared key on both sides and restart negotiation",
   "Agree a common proposal, ideally by upgrading the peer to AES-GCM-256 with DH group 19 or 20",
   "Correct the traffic selectors so that both peers' protected subnets mirror each other exactly",
   "Enable NAT traversal on both peers to move IKE traffic to UDP 4500"
  ],
  "answer": 1,
  "explain": "NO_PROPOSAL_CHOSEN in IKE_SA_INIT means no overlapping crypto suite. PSKs are checked in IKE_AUTH, selectors at Child SA creation, and NAT-T is unrelated."
 },
 {
  "module": "m3",
  "q": "A route-based VPN shows the IKE SA READY. `show crypto ipsec sa` reports `#pkts encaps: 0, #pkts decaps: 15320`. Users at the local site cannot reach the remote site. Where is the fault most likely to be?",
  "options": [
   "At the remote peer, which is not routing its return traffic back into the tunnel interface",
   "Locally: traffic is not being routed into the tunnel interface, or it is NATed before encryption",
   "In the ISP path, which is silently dropping inbound ESP packets arriving from the remote peer",
   "In IKE_AUTH, where the certificates failed mutual authentication"
  ],
  "answer": 1,
  "explain": "Decaps are increasing, so the peer is sending and ESP arrives. Nothing is encrypted locally, pointing to local routing or NAT. The IKE SA is up, so authentication succeeded."
 },
 {
  "module": "m3",
  "q": "A tunnel establishes normally but fails exactly every 8 hours, re-establishing after about a minute. Logs at the failure show the CREATE_CHILD_SA exchange rejected. One peer's Child SA lifetime is 28,800 seconds. What should be checked first?",
  "options": [
   "Whether the IKE SA lifetimes match exactly, to the second, on both of the peers",
   "Whether the certificate on the remote peer expires in eight hours",
   "Whether the tunnel MTU is large enough for the rekey messages",
   "Whether the PFS DH group used for Child SA rekeys is configured identically on both peers"
  ],
  "answer": 3,
  "explain": "The failure aligns with the Child SA rekey, where PFS is applied in IKEv2. IKE SA lifetimes need not match exactly; certificate expiry would not recur every eight hours; MTU is not the classic cause."
 },
 {
  "module": "m3",
  "q": "Hub logs show: `Certificate chain verified to CORP-ROOT-CA` then `OCSP request to http://ocsp.corp.example timed out` then `Sending AUTHENTICATION_FAILED`. Eleven branches are down. What is the best immediate action?",
  "options": [
   "Restore the OCSP responder or its reachability, using a documented, time-boxed CRL fallback if needed",
   "Disable revocation checking permanently on the hub so this kind of outage can never recur",
   "Reissue certificates to all eleven branches from the issuing CA",
   "Switch all branches to a shared pre-shared key until the PKI is redesigned"
  ],
  "answer": 0,
  "explain": "The chain is valid; the revocation service is unreachable. Restore it, with a controlled CRL fallback if needed. Permanent disablement or a shared PSK weakens security; reissuing does not fix OCSP."
 },
 {
  "module": "m3",
  "q": "A company with 180 branches needs branch-to-branch voice calls without hairpinning through the hub, and wants to add branches without touching every other branch's configuration. Which design fits best?",
  "options": [
   "A full mesh of static policy-based tunnels, with mirrored crypto ACLs maintained at every site",
   "A single policy-based tunnel from each branch to the hub with no spoke-to-spoke paths",
   "A dynamic overlay using mGRE, NHRP and certificate-based IKEv2 that builds on-demand spoke-to-spoke tunnels",
   "Remote-access VPN clients installed on each branch's phones and call servers"
  ],
  "answer": 2,
  "explain": "Dynamic overlays give on-demand direct paths and add spokes with no config change elsewhere. A static full mesh needs about 16,000 tunnels; hub-only adds latency; remote-access clients are not a site design."
 },
 {
  "module": "m3",
  "q": "A partner's policy-based VPN works for subnet 10.3.0.0/16 but not for newly added 10.4.0.0/16. Your logs show `TS_UNACCEPTABLE` when traffic from 10.4.0.0/16 triggers negotiation. What is the cause?",
  "options": [
   "The partner's Diffie-Hellman group no longer matches after the subnet change",
   "The IKE SA lifetime expired and was not renewed correctly",
   "ESP traffic for the new subnet is blocked by the ISP",
   "The new subnet pair is missing from the crypto ACLs"
  ],
  "answer": 3,
  "explain": "TS_UNACCEPTABLE indicates traffic selectors outside the peer's policy. DH problems surface in IKE_SA_INIT, lifetimes do not cause selector errors and ISP filtering does not generate this notify."
 },
 {
  "module": "m3",
  "q": "After a weekend power outage, a branch router cannot bring up its certificate-based tunnel. The log says `peer certificate not yet valid`. The hub's certificate was issued three months ago. What is the most likely cause?",
  "options": [
   "The hub's certificate was revoked by the issuing CA during the weekend outage",
   "The branch router's clock is wrong and NTP has not resynchronised it",
   "The branch's RSA private key was lost during the power outage",
   "The IKEv2 proposal on the hub was changed during the weekend"
  ],
  "answer": 1,
  "explain": "'Not yet valid' means the local clock is earlier than the certificate's start date, which happens when a clock resets. Revocation, key loss or proposal changes give different errors."
 },
 {
  "module": "m3",
  "q": "Remote-access VPN users on a hotel network can connect with the TLS-based client but not with the IKEv2 client. Both use the same gateway and MFA. What is the most likely reason?",
  "options": [
   "IKEv2 cannot support MFA, so user authentication always fails on that client type",
   "The IKEv2 client requires the user to be on the corporate LAN",
   "The hotel blocks UDP 500 and 4500, which IKEv2 needs, but allows TCP 443",
   "The TLS-based client is negotiating a weaker cipher suite that hotel firewalls happen to permit"
  ],
  "answer": 2,
  "explain": "Restrictive networks often allow only TCP 443. IKEv2 supports MFA via EAP, works remotely and cipher strength is not what hotels filter."
 },
 {
  "module": "m4",
  "q": "A switch shows `Status: Unauthorized`, `dot1x: Authc Failed`, `mab: Authc Failed` for a new IP camera. The NAC server log shows `Access-Reject: endpoint MAC not found in any identity group`. What is the correct fix?",
  "options": [
   "Profile and register the camera with a narrow IoT policy",
   "Change the port to `authentication open` permanently so the camera works without registration",
   "Install an 802.1X supplicant on the camera using the default admin password",
   "Assign the camera to the employee VLAN so it can reach the video server"
  ],
  "answer": 0,
  "explain": "The reject is due to an unknown MAC; registration plus narrow policy fixes it safely. Permanent open mode removes control, using default passwords is insecure and the employee VLAN grants excessive access."
 },
 {
  "module": "m4",
  "q": "A penetration test captured PEAP exchanges from staff laptops connecting to a fake SSID with the same name. What is the root cause, and what is the best long-term remedy?",
  "options": [
   "The RADIUS shared secret was weak; rotate it to a longer random value on every access point",
   "The SSID was broadcast; hide it so attackers cannot copy the name",
   "Missing server validation; enforce it, then adopt EAP-TLS",
   "The switch did not support CoA; upgrade access switches to enable it"
  ],
  "answer": 2,
  "explain": "Clients accepted any server, allowing an evil twin to capture credentials. Validation fixes the gap and EAP-TLS removes passwords. The shared secret, SSID broadcast and CoA are not involved."
 },
 {
  "module": "m4",
  "q": "An EDR platform flags ransomware behaviour on a laptop connected to an 802.1X port. The SOC wants it restricted within seconds without visiting the site. Which capability makes this possible?",
  "options": [
   "A RADIUS change-of-authorisation request sent by the NAC server",
   "A shorter DHCP lease so that the laptop must renew its address within minutes",
   "A periodic reauthentication timer set to eight hours on every access port",
   "A port-security limit allowing only one MAC address per port"
  ],
  "answer": 0,
  "explain": "CoA (RFC 5176) lets the server push quarantine policy immediately. DHCP leases and timers are slow, and port security does not quarantine."
 },
 {
  "module": "m4",
  "q": "Which configuration best protects core-router administration?",
  "options": [
   "RADIUS with a shared 'netadmin' account whose password is changed quarterly",
   "Local accounts on every device with identical strong passwords tracked in a shared spreadsheet by the team",
   "SSH key authentication with one key pair shared across the whole network team",
   "Named TACACS+ accounts with command authorisation, accounting and MFA"
  ],
  "answer": 3,
  "explain": "Named, authorised, accounted and MFA-protected access gives control and evidence. Shared accounts or keys destroy accountability, and local accounts do not scale."
 },
 {
  "module": "m4",
  "q": "A RADIUS assessment flags that network devices accept Access-Accept packets without a Message-Authenticator attribute for PAP-based logins. What risk does this create, and what is the fix?",
  "options": [
   "Users' passwords travel in clear text; move every network device to TACACS+ immediately",
   "On-path forgery of accepts via MD5 collisions; require Message-Authenticator and patch both ends",
   "Accounting records may be lost; increase the RADIUS server timeout and retries",
   "Dynamic VLANs will fail; add Tunnel attributes to every authorisation profile"
  ],
  "answer": 1,
  "explain": "This is the BlastRADIUS forgery risk; requiring Message-Authenticator and patching mitigates it. The other options describe unrelated problems or fixes."
 },
 {
  "module": "m4",
  "q": "An NAC policy maps posture 'unknown' to full employee access 'to avoid help-desk calls'. The MDM integration fails for six hours and nobody notices. What is the main design flaw?",
  "options": [
   "The posture check runs too frequently and overloads the MDM platform's API during business hours",
   "It fails open, so any device missing posture data gets full access",
   "The MDM integration should be replaced with manual device approval",
   "Full employee access should be applied only to wired connections"
  ],
  "answer": 1,
  "explain": "'Unknown' should lead to restricted access; otherwise every outage or unmanaged device silently gains full access. Frequency, manual approval and wired-only access do not address the fail-open logic."
 },
 {
  "module": "m4",
  "q": "The SOC sees 30 denied push prompts for one user followed by an approval from an unfamiliar country. A VPN session is now active. Which response is best?",
  "options": [
   "Reset the password only, because the active session will end automatically when the user logs off",
   "Block the country at the gateway and keep monitoring the active session",
   "Increase the push-prompt timeout so the user has more time to read it",
   "Contain the session, verify the user, move to phishing-resistant MFA"
  ],
  "answer": 3,
  "explain": "This is an MFA-fatigue compromise; contain the session, confirm with the user and fix the authenticator weakness. A password reset may leave the session alive; geo-blocking is bypassable; longer timeouts help the attacker."
 }
]);
