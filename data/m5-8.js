window.TRACK = window.TRACK || { modules: [], exam: [] };
TRACK.modules.push({
 "id": "m5",
 "order": 5,
 "code": "Detect",
 "title": "Detect — Threat Detection & Prevention",
 "subtitle": "See hostile activity early and stop it with confidence: network sensors, email, web, DNS, endpoints and deception.",
 "outcomes": [
  "Design IDS and IPS deployments that balance visibility, blocking, latency and failure behaviour.",
  "Measure and tune detections using precision, recall and documented use-case cards.",
  "Protect domains with SPF, DKIM and DMARC and defend against lookalike phishing.",
  "Apply URL filtering, selective decryption and protective DNS, and detect DNS abuse.",
  "Use EDR, XDR and deception to catch threats the network cannot see."
 ],
 "lessons": [
  {
   "id": "m5-l1",
   "title": "Detection Engines: IDS, IPS and How They Decide",
   "subtitle": "Passive versus inline sensing, the four detection methods and where each one fails",
   "minutes": 35,
   "objectives": [
    "Contrast IDS and IPS deployments by visibility, blocking ability, latency and failure behaviour.",
    "Explain signature, anomaly, behavioural and reputation detection and the blind spots of each.",
    "Read and reason about site-specific rules and the alerts they generate."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "The **Detect** layer of the ZCIE Security Defence-in-Depth Stack assumes that something has already slipped past the perimeter, the tunnel and the identity checks you built in Modules 2 to 4. Its job is to notice hostile activity quickly and, where confidence is high enough, stop it in-line. Expert engineers are judged less on whether they can switch a sensor on and more on whether they can explain **what it can see, what it will miss and what happens when it breaks**."
    },
    {
     "type": "compare",
     "title": "IDS versus IPS",
     "columns": [
      {
       "title": "Intrusion detection system (IDS)",
       "items": [
        "Receives a **copy** of traffic from a SPAN port, TAP or packet broker",
        "Cannot drop packets; it raises alerts for people or automation to act on",
        "Zero added latency and no outage if the sensor fails",
        "Ideal for new rule sets, forensic visibility and noisy segments",
        "Response is always after the fact, even if only by seconds"
       ]
      },
      {
       "title": "Intrusion prevention system (IPS)",
       "items": [
        "Sits **in the forwarding path** as a bridge, routed hop or NGFW engine",
        "Can drop, reset or rewrite traffic before it reaches the target",
        "Adds latency and becomes a failure point; needs bypass design",
        "Should block only on high-confidence signatures",
        "A false positive becomes a self-inflicted outage"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Sensor deployment modes",
     "head": [
      "Mode",
      "What it sees",
      "Can block?",
      "Main risk"
     ],
     "rows": [
      [
       "SPAN / mirror port",
       "Copied frames, may drop under load",
       "No",
       "Oversubscription silently loses packets"
      ],
      [
       "Passive network TAP",
       "Every frame on the link, both directions",
       "No",
       "Extra hardware and cabling per link"
      ],
      [
       "Inline layer-2 bridge",
       "All traffic crossing the bridge",
       "Yes",
       "Outage on failure unless bypass is fitted"
      ],
      [
       "Engine inside an NGFW",
       "Traffic matched by the firewall policy",
       "Yes",
       "Throughput drops sharply with full inspection"
      ],
      [
       "Host-based sensor",
       "Decrypted traffic and process context",
       "Yes, on that host",
       "Coverage gaps on unmanaged devices"
      ]
     ]
    },
    {
     "type": "framework",
     "title": "Four ways a sensor decides",
     "items": [
      {
       "label": "SIG",
       "title": "Signature",
       "text": "Matches known patterns such as byte strings, protocol fields or certificate attributes. Precise and explainable, but blind to anything it has never seen."
      },
      {
       "label": "ANOM",
       "title": "Anomaly",
       "text": "Builds a statistical baseline (volume, ports, peers, timing) and flags deviation. Finds the unknown but needs a clean baseline and produces more noise."
      },
      {
       "label": "BEH",
       "title": "Behavioural",
       "text": "Looks for sequences of actions that together indicate an attacker goal, for example scanning followed by remote service creation. Strong against tool changes."
      },
      {
       "label": "REP",
       "title": "Reputation",
       "text": "Scores destinations, files and certificates using threat intelligence. Cheap and fast, but stale feeds create both misses and false blocks."
      }
     ]
    },
    {
     "type": "flow",
     "title": "How an inline engine reaches a verdict",
     "items": [
      {
       "label": "Capture",
       "text": "Packet arrives on the inline pair or tap"
      },
      {
       "label": "Decode",
       "text": "Layer-2 to layer-4 headers parsed and validated"
      },
      {
       "label": "Reassemble",
       "text": "IP fragments and TCP streams rebuilt and normalised"
      },
      {
       "label": "Parse",
       "text": "Application protocol identified regardless of port"
      },
      {
       "label": "Match",
       "text": "Rules, models and reputation evaluated"
      },
      {
       "label": "Verdict",
       "text": "Pass, alert, drop or reset, then log the event"
      }
     ]
    },
    {
     "type": "cli",
     "title": "Site-specific rules in an open-source IDS/IPS",
     "device": "Sensor S1 · Suricata rules (local.rules)",
     "lines": [
      "# Local SID range 1000000-1999999 keeps site rules apart from vendor feeds",
      "alert dns $HOME_NET any -> any any (msg:\"ZZ-LOCAL lookup of blocklisted update domain\"; dns.query; content:\"update-check.badsite.example\"; nocase; endswith; classtype:trojan-activity; sid:1000101; rev:2;)",
      "drop tls $HOME_NET any -> $EXTERNAL_NET any (msg:\"ZZ-LOCAL TLS to retired file-share service\"; tls.sni; content:\"files.legacyshare.example\"; nocase; endswith; classtype:policy-violation; sid:1000102; rev:1;)",
      "alert tcp $HOME_NET any -> $EXTERNAL_NET 3389 (msg:\"ZZ-LOCAL outbound RDP to internet\"; flow:to_server; flags:S; classtype:policy-violation; sid:1000103; rev:1;)",
      "# Resulting alert in eve.json (trimmed)",
      "{\"timestamp\":\"2026-03-14T09:12:44.118+0000\",\"event_type\":\"alert\",\"src_ip\":\"10.20.4.57\",\"dest_ip\":\"10.0.0.53\",\"proto\":\"UDP\",\"app_proto\":\"dns\",\"alert\":{\"action\":\"allowed\",\"signature_id\":1000101,\"rev\":2,\"severity\":1}}"
     ],
     "note": "A `drop` rule only blocks when the engine runs in inline (IPS) mode; in IDS mode it is logged as an alert. The alert shows `action: allowed` because the rule is alert-only, and severity 1 comes from the class type priority."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "TLS 1.3 encrypts the server certificate, QUIC moves web traffic to UDP 443 and Encrypted Client Hello hides the real server name. A network sensor that cannot decrypt is left with flow metadata, JA4-style client fingerprints, IP reputation and timing. Plan detection for encrypted traffic on purpose: decrypt selectively at the secure web gateway, push detection to endpoints, and treat SNI-based rules as a shrinking asset.",
     "title": "Encryption is the sensor's biggest blind spot"
    },
    {
     "type": "keypoints",
     "title": "Placement rules of thumb",
     "items": [
      "Put an **IDS** where you need visibility without risk: east-west core links, data-centre spines, cloud traffic mirrors.",
      "Put an **IPS** where blocking pays for its latency: internet edge, partner links and in front of crown-jewel segments.",
      "Fit hardware **bypass** or clustering on every inline sensor and decide fail-open versus fail-closed per link, in writing.",
      "Monitor sensor health (drops, CPU, rule-load errors) as carefully as you monitor its alerts.",
      "Start every new inline deployment in detect-only mode and promote rules to blocking deliberately."
     ]
    },
    {
     "type": "scenario",
     "situation": "A brokerage wants intrusion prevention between its order-entry gateways and the internet. The application team says any extra delay above 200 microseconds or any outage during market hours is unacceptable. What is the strongest design?",
     "options": [
      {
       "text": "Deploy inline with every vendor rule set to drop from day one, because the segment is business-critical and must have the strongest possible protection.",
       "feedback": "Blocking everything immediately makes false positives into trading outages and ignores the stated latency limit.",
       "best": false
      },
      {
       "text": "Mirror the traffic to a passive IDS only, and never consider prevention because any inline device will break trading.",
       "feedback": "Safe but defeatist. A tested fail-open inline design can meet the requirement and gives blocking where it matters.",
       "best": false
      },
      {
       "text": "Deploy inline with a fail-open hardware bypass, run detect-only while tuning, then block only on a small set of high-confidence signatures.",
       "feedback": "Best. It respects the availability requirement, measures real latency before blocking, and limits drop actions to rules whose false-positive rate you have proven.",
       "best": true
      },
      {
       "text": "Move inspection to the endpoints on the order gateways and remove all network sensors because hosts see decrypted traffic.",
       "feedback": "Host sensors add value but removing network visibility leaves no independent view, and gateway agents may themselves add latency.",
       "best": false
      }
     ],
     "title": "Protecting a latency-sensitive trading segment"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Intrusion prevention system (IPS)",
       "def": "An inline inspection engine that can drop, reset or modify traffic in real time based on rules, models or reputation."
      },
      {
       "term": "Fail-open",
       "def": "A failure mode in which an inline device passes traffic uninspected when it fails, protecting availability at the cost of security."
      },
      {
       "term": "Behavioural detection",
       "def": "Detection based on sequences of actions that indicate attacker intent, rather than on a single known pattern."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A sensor connected to a switch SPAN port reports far fewer sessions than the firewall during peak hours. What is the most likely cause?",
       "options": [
        "The sensor is running in inline mode and is blocking most of the peak traffic",
        "The SPAN session is oversubscribed and the switch is dropping mirrored frames",
        "The firewall is double-counting sessions because of asymmetric return routing",
        "The detection rules are filtering out sessions that do not match a signature"
       ],
       "answer": 1,
       "explain": "Mirror ports are best-effort; when the mirrored links exceed the destination port's capacity, frames are dropped silently. A passive TAP or packet broker avoids this. A SPAN-attached sensor cannot block, and rules do not change session counts."
      },
      {
       "q": "Which detection method is most likely to catch a brand-new remote access tool used to create services on many servers in sequence?",
       "options": [
        "Signature detection using the vendor's latest file-hash content updates",
        "Reputation scoring of the destination addresses the servers communicate with",
        "Behavioural detection that correlates remote service creation across hosts",
        "Port-based allow lists that permit only approved management protocols"
       ],
       "answer": 2,
       "explain": "A new tool has no signature or hash yet and may use internal addresses with no reputation. The behaviour of creating services across many hosts in a short time remains suspicious whichever tool performs it."
      },
      {
       "q": "An inline sensor has a `drop` rule, yet the matching traffic still reaches the server and eve.json records the event. What explains this?",
       "options": [
        "The engine is running in IDS mode, where drop rules are logged but not enforced",
        "The rule needs a higher revision number before the engine will enforce drops",
        "Drop rules only work for TCP, so the matching UDP traffic is always allowed",
        "The rule must also include a threshold keyword before blocking is enabled"
       ],
       "answer": 0,
       "explain": "Enforcement depends on the engine running in inline (IPS) mode. In passive mode a drop rule behaves like an alert. Revision numbers and thresholds do not enable blocking, and drop works for UDP too."
      },
      {
       "q": "Why is a false positive more expensive on an IPS than on an IDS?",
       "options": [
        "Because the IPS stores more packet data, so each alert costs more disk space",
        "Because the IPS requires a licence per alert, so noise increases the subscription",
        "Because the IPS cannot be tuned, so every false positive must be reported to the vendor",
        "Because the IPS blocks legitimate traffic, so the error becomes an outage"
       ],
       "answer": 3,
       "explain": "An IDS false positive wastes analyst time; an IPS false positive drops real business traffic. That is why prevention policies are narrower and promoted only after tuning."
      },
      {
       "q": "Your web traffic is moving to TLS 1.3 with Encrypted Client Hello. Which detection approach loses the most value?",
       "options": [
        "Endpoint telemetry that records which process opened each connection",
        "Network rules that match the server name in the TLS handshake",
        "Flow analytics that measure byte counts, timing and peer relationships",
        "Selective decryption at a secure web gateway for high-risk categories"
       ],
       "answer": 1,
       "explain": "Encrypted Client Hello hides the real server name, so SNI-matching rules become far less useful. Endpoint telemetry, flow analytics and gateway decryption are unaffected or still workable."
      }
     ]
    }
   ]
  },
  {
   "id": "m5-l2",
   "title": "Tuning, False Positives and Detection Engineering",
   "subtitle": "Turn a noisy sensor into a trusted one with measurement, disciplined tuning and use-case cards",
   "minutes": 40,
   "objectives": [
    "Measure detection quality with precision, recall and false-positive rate.",
    "Choose between rewriting, scoping, thresholding, suppressing and disabling a noisy rule.",
    "Explain the role of malware analysis sandboxes and their limits.",
    "Document detections as reviewable use-case cards."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "A detection that fires 4,000 times a day is not a control; it is background noise that hides the one alert that matters. **Detection engineering** treats rules like code: each has a purpose, an owner, test data, a measured error rate and a review date. Tuning is not about making the console quiet. It is about raising the share of alerts that deserve a human's attention without losing the ones that catch real attacks."
    },
    {
     "type": "table",
     "title": "The four outcomes of every detection decision",
     "head": [
      "Outcome",
      "Reality",
      "Sensor said",
      "Cost"
     ],
     "rows": [
      [
       "True positive (TP)",
       "Malicious",
       "Alert",
       "The value you are paying for"
      ],
      [
       "False positive (FP)",
       "Benign",
       "Alert",
       "Analyst time, fatigue and, on an IPS, outages"
      ],
      [
       "True negative (TN)",
       "Benign",
       "Silent",
       "None"
      ],
      [
       "False negative (FN)",
       "Malicious",
       "Silent",
       "The breach you find months later"
      ]
     ]
    },
    {
     "type": "formula",
     "title": "Measuring a detection",
     "items": [
      {
       "name": "Precision",
       "expr": "TP / (TP + FP)",
       "meaning": "Share of alerts that are real. Low precision causes alert fatigue."
      },
      {
       "name": "Recall (detection rate)",
       "expr": "TP / (TP + FN)",
       "meaning": "Share of real attacks that were caught. Measure it with purple-team tests and replayed captures."
      },
      {
       "name": "False-positive rate",
       "expr": "FP / (FP + TN)",
       "meaning": "Share of benign events wrongly flagged. Even 0.1% is huge when the denominator is millions of events a day."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "example",
     "text": "A rule examines 2,000,000 benign DNS queries and 20 malicious ones per day. It catches 19 of the 20 attacks and has a false-positive rate of only 0.05%. That still produces 1,000 false alerts, so precision is 19 / (19 + 1,000), under 2%. An analyst will learn to ignore it. Good recall alone is not enough when the benign population is enormous.",
     "title": "Why base rates matter"
    },
    {
     "type": "steps",
     "title": "A disciplined tuning workflow",
     "items": [
      {
       "title": "Baseline",
       "text": "Rank rules by alert volume and by analyst disposition (true, false, benign-but-expected) over the last 30 days."
      },
      {
       "title": "Find the root cause",
       "text": "Is the rule wrong, the network variables wrong, or the activity genuinely expected (a scanner, a backup job)?"
      },
      {
       "title": "Fix the environment first",
       "text": "Correct `$HOME_NET`, server groups and asset tags; many false positives vanish without touching a rule."
      },
      {
       "title": "Pick the narrowest action",
       "text": "Rewrite, scope to hosts, threshold, suppress for one source, and only then disable."
      },
      {
       "title": "Peer review and ticket",
       "text": "Every change has a reason, an approver and an expiry or review date."
      },
      {
       "title": "Regression test",
       "text": "Replay known-bad captures to prove the rule still fires after tuning."
      }
     ]
    },
    {
     "type": "table",
     "title": "Tuning actions compared",
     "head": [
      "Action",
      "Use when",
      "Risk if misused"
     ],
     "rows": [
      [
       "Rewrite the rule",
       "The logic is too broad or matches benign content",
       "Breaking detection of the original threat"
      ],
      [
       "Scope by variables or asset groups",
       "Rule is right but applied to the wrong hosts",
       "Wrong groups hide real targets"
      ],
      [
       "Threshold or rate-limit",
       "Repeated identical alerts from one source",
       "Low-and-slow activity stays under the count"
      ],
      [
       "Suppress for a specific source",
       "One known, approved system triggers the rule",
       "That system becomes an invisible pivot point"
      ],
      [
       "Disable",
       "Rule is irrelevant to your environment",
       "You lose coverage if the environment changes"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Documented tuning in threshold.config",
     "device": "Sensor S1 · Suricata threshold.config",
     "lines": [
      "# CHG-2291 vulnerability scanner 10.9.0.15 trips scan rule; owner: VM team; review 2026-09-30",
      "suppress gen_id 1, sig_id 1000201, track by_src, ip 10.9.0.15",
      "# CHG-2305 one alert per source per 10 minutes for a noisy policy rule",
      "threshold gen_id 1, sig_id 1000104, type limit, track by_src, count 1, seconds 600",
      "# CHG-2311 alert only after 20 failed logins from one source within 60 seconds",
      "threshold gen_id 1, sig_id 1000204, type threshold, track by_src, count 20, seconds 60"
     ],
     "note": "Suppression is scoped to one source address, never to the whole rule. Comments tie each line to a change ticket, an owner and a review date so the file can be audited."
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "A sandbox **detonates** suspicious files or URLs in an instrumented virtual machine and records what they do: processes spawned, files written, registry changes, network callbacks. Verdicts and extracted indicators then feed the email gateway, web gateway, IPS and EDR. Sandboxes complement but never replace other layers, because some malware checks for analysis environments, waits before acting or needs user interaction, and encrypted or password-protected archives may never be opened.",
     "title": "Malware analysis sandboxes in one paragraph"
    },
    {
     "type": "compare",
     "title": "Static versus dynamic analysis",
     "columns": [
      {
       "title": "Static analysis",
       "items": [
        "Examines a file without running it",
        "Hashes, strings, headers, imports, embedded macros",
        "Fast and safe at scale",
        "Defeated by packing and obfuscation"
       ]
      },
      {
       "title": "Dynamic analysis (sandbox)",
       "items": [
        "Runs the sample in an isolated, instrumented environment",
        "Observes real behaviour and network callbacks",
        "Slower and resource-heavy",
        "Can be evaded by environment checks and delays"
       ]
      }
     ]
    },
    {
     "type": "template",
     "title": "Detection use-case card",
     "purpose": "Capture every detection as a reviewable engineering artefact rather than an unexplained rule in a console.",
     "columns": [
      "Use case and ID",
      "ATT&CK technique",
      "Data sources",
      "Logic summary",
      "Known false positives and tuning",
      "Response and owner",
      "Last tested / review"
     ],
     "example": [
      [
       "UC-NET-014 Outbound RDP to internet",
       "T1021.001 Remote Desktop Protocol (outbound misuse)",
       "Firewall logs, IPS sid 1000103, flow records",
       "TCP SYN from internal hosts to external port 3389",
       "Approved vendor jump host 10.40.2.8 excluded by asset tag",
       "Tier 1 validates user and host; SOC lead owns the rule",
       "Purple test 2026-05-02 / review 2026-11-02"
      ]
     ],
     "rows": 6
    },
    {
     "type": "scenario",
     "situation": "A data-exfiltration rule alerts about 4,000 times a day, and almost every alert comes from the nightly backup server sending large encrypted archives to the cloud backup provider. The rule also fired once last quarter on a genuine incident. What should you do?",
     "options": [
      {
       "text": "Disable the rule entirely, because 99.9% of its alerts are false positives and the analysts on shift already ignore it anyway.",
       "feedback": "Throws away a rule that has caught a real incident. Volume should be fixed by scoping, not by losing coverage.",
       "best": false
      },
      {
       "text": "Confirm the backup flow is approved, then suppress the rule for that source and destination only, with a ticket and expiry.",
       "feedback": "Best. The narrowest change removes the known noise and preserves the rule's demonstrated value everywhere else.",
       "best": true
      },
      {
       "text": "Leave the rule as it is and ask Tier 1 analysts to close backup-server alerts in bulk every morning.",
       "feedback": "Bulk-closing trains analysts to ignore the rule and wastes time; a real exfiltration from that server would be closed too.",
       "best": false
      },
      {
       "text": "Raise the rule's threshold for all hosts so it only alerts above 50 GB per hour of outbound transfer.",
       "feedback": "A global threshold blinds the rule to smaller thefts from every other host to fix a problem caused by one host.",
       "best": false
      }
     ],
     "title": "A rule that fires 4,000 times a day"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Precision",
       "def": "The proportion of alerts that turn out to be true positives: TP / (TP + FP)."
      },
      {
       "term": "Suppression",
       "def": "A tuning entry that silences a specific rule for a specific source or destination while leaving it active elsewhere."
      },
      {
       "term": "Detonation",
       "def": "Running a suspicious file or URL inside an isolated sandbox to observe its behaviour."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A rule has 95% recall in purple-team tests but analysts close 98% of its alerts as benign. What does this tell you?",
       "options": [
        "It catches most attacks but has very low precision, so it needs tuning to stay useful",
        "It is both accurate and efficient, so the analysts are closing real attacks by mistake",
        "It has a high false-negative rate, so it misses most attacks and should be rewritten",
        "It is behaving normally for a signature, so no action is needed beyond retraining staff"
       ],
       "answer": 0,
       "explain": "High recall means few misses; a 98% benign closure rate means precision around 2%. The rule works but drowns analysts, so the fix is tuning, not removal and not blaming staff."
      },
      {
       "q": "A vulnerability scanner triggers dozens of IPS rules every week. What is the most appropriate tuning?",
       "options": [
        "Disable the affected rules globally because they only ever fire during authorised scans",
        "Move the scanner into the same subnet as the sensor management interface to hide it",
        "Raise the severity of the rules so that scanner alerts stand out in the console more",
        "Suppress the rules for the scanner's source address only, with a ticket and review date"
       ],
       "answer": 3,
       "explain": "Suppressing per source removes known noise while keeping the rules for everyone else. Global disabling loses coverage, and hiding the scanner or raising severity does nothing for quality."
      },
      {
       "q": "Why should many false positives be fixed by correcting `$HOME_NET` and server group variables before touching rules?",
       "options": [
        "The variables control licensing, so wrong values cause rules to load in a reduced mode",
        "The variables set alert severity, so wrong values make benign alerts appear critical",
        "Rules depend on those variables, so wrong values make correct rules match the wrong traffic",
        "The variables decide which vendor feed is used, so wrong values pull an outdated feed"
       ],
       "answer": 2,
       "explain": "Rule direction and scope are written in terms of these variables. If internal ranges or server groups are wrong, otherwise correct rules fire on, or miss, the wrong flows."
      },
      {
       "q": "A sandbox returns a clean verdict for an attachment that later proves malicious. Which explanation is most plausible?",
       "options": [
        "The sandbox only performs static analysis, so it never runs attachments of that type",
        "Clean verdicts always mean the file was encrypted with the recipient's public key",
        "The email gateway must have stripped the payload before the sandbox could analyse it",
        "The sample detected the analysis environment or waited before acting, so it showed nothing"
       ],
       "answer": 3,
       "explain": "Environment checks and delayed execution are well-known reasons for clean sandbox verdicts. That is why sandboxes are one layer among several and why endpoint detection remains essential."
      },
      {
       "q": "What makes a detection use-case card more valuable than the rule text alone?",
       "options": [
        "It replaces the need to test the rule because the logic is described in plain language",
        "It allows the rule to run without any data sources because the logic is documented",
        "It records purpose, technique, data sources, known false positives, owner and test date",
        "It is required by the sensor to compile the rule into its running configuration"
       ],
       "answer": 2,
       "explain": "The card makes the rule reviewable and maintainable: why it exists, what it maps to, what feeds it, how it was tuned, who owns it and when it was last proven to work."
      }
     ]
    }
   ]
  },
  {
   "id": "m5-l3",
   "title": "Email Security: SPF, DKIM and DMARC",
   "subtitle": "Authenticate your domains, read authentication results and stop the phishing that authentication cannot",
   "minutes": 40,
   "objectives": [
    "Explain what SPF, DKIM and DMARC each verify and how alignment ties them to the visible From address.",
    "Write and review SPF, DKIM and DMARC DNS records for active and parked domains.",
    "Plan a safe DMARC rollout from monitoring to reject.",
    "Combine authentication with layered controls against lookalike-domain phishing."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Phishing remains the most common initial-access technique (ATT&CK **T1566**). Email authentication protects **your** domain from being forged, and it gives receivers evidence about everyone else's mail. It does not judge intent: a criminal who registers a lookalike domain can publish perfect SPF, DKIM and DMARC records. Expert design therefore combines authentication with content, link and user-behaviour controls."
    },
    {
     "type": "flow",
     "title": "How a receiver evaluates an inbound message",
     "items": [
      {
       "label": "SMTP envelope",
       "text": "Receiver notes the connecting IP and the MAIL FROM domain"
      },
      {
       "label": "SPF",
       "text": "Is this IP authorised to send for the MAIL FROM domain?"
      },
      {
       "label": "DKIM",
       "text": "Does the signature verify with the public key for the signing domain?"
      },
      {
       "label": "Alignment",
       "text": "Does a passing SPF or DKIM domain match the header From domain?"
      },
      {
       "label": "DMARC policy",
       "text": "Apply the From domain's policy: none, quarantine or reject"
      },
      {
       "label": "Reporting",
       "text": "Aggregate reports return to the domain owner's rua address"
      }
     ]
    },
    {
     "type": "table",
     "title": "SPF, DKIM and DMARC compared",
     "head": [
      "Aspect",
      "SPF",
      "DKIM",
      "DMARC"
     ],
     "rows": [
      [
       "Verifies",
       "Sending IP is authorised for the envelope domain",
       "Message signed by the d= domain and unaltered",
       "SPF or DKIM pass **and** align with header From"
      ],
      [
       "Identifier",
       "RFC5321.MailFrom (envelope)",
       "d= in the DKIM-Signature header",
       "RFC5322.From (what users see)"
      ],
      [
       "Survives forwarding?",
       "Usually not; the forwarder's IP is not listed",
       "Yes, unless the body or signed headers change",
       "Yes if DKIM survives"
      ],
      [
       "Common pitfall",
       "More than 10 DNS lookups causes a permanent error",
       "Weak 1024-bit keys and never-rotated selectors",
       "Stuck at p=none forever"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Authentication records for an active and a parked domain",
     "device": "DNS zone · bank.example",
     "lines": [
      "# SPF: only the two outbound gateways and the payroll provider may send as bank.example",
      "bank.example.                    3600 IN TXT \"v=spf1 ip4:203.0.113.25 ip4:203.0.113.26 include:_spf.payroll-provider.example -all\"",
      "# DKIM public key under a dated selector (key shortened for print)",
      "mx2026a._domainkey.bank.example. 3600 IN TXT \"v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...IDAQAB\"",
      "# DMARC: reject unaligned mail, strict DKIM alignment, aggregate reports",
      "_dmarc.bank.example.             3600 IN TXT \"v=DMARC1; p=reject; sp=reject; adkim=s; aspf=r; rua=mailto:dmarc-agg@bank.example\"",
      "# Parked domain that never sends or receives mail",
      "bank-loans.example.              3600 IN MX  0 .",
      "bank-loans.example.              3600 IN TXT \"v=spf1 -all\"",
      "_dmarc.bank-loans.example.       3600 IN TXT \"v=DMARC1; p=reject\""
     ],
     "note": "`-all` hard-fails unlisted senders. `sp=reject` covers subdomains. The null MX (`MX 0 .`) declares that the parked domain accepts no mail, and `v=spf1 -all` says it sends none."
    },
    {
     "type": "cli",
     "title": "Reading the headers of a reported phish",
     "device": "Mail headers · message reported by a teller",
     "lines": [
      "Authentication-Results: mx1.bank.example;",
      "  spf=pass smtp.mailfrom=notify@bank-secure-login.example;",
      "  dkim=pass header.d=bank-secure-login.example;",
      "  dmarc=pass header.from=bank-secure-login.example",
      "From: \"Bank IT Service Desk\" <notify@bank-secure-login.example>",
      "Subject: Action required: re-verify your MFA device today"
     ],
     "note": "Everything passes because the attacker owns the lookalike domain. Authentication proved who sent it, not that the sender is trustworthy. Detection must come from domain age, lookalike matching, link analysis and user reports."
    },
    {
     "type": "steps",
     "title": "Rolling DMARC out without breaking legitimate mail",
     "items": [
      {
       "title": "Inventory senders",
       "text": "List every system and provider that sends as your domain: gateways, CRM, HR, ticketing, marketing."
      },
      {
       "title": "Publish p=none with reporting",
       "text": "Collect aggregate reports for at least two to four weeks to see who really sends as you."
      },
      {
       "title": "Fix legitimate sources",
       "text": "Add them to SPF within the 10-lookup limit or, better, have them DKIM-sign with your domain."
      },
      {
       "title": "Move to quarantine",
       "text": "Unaligned mail goes to junk; watch reports and helpdesk tickets."
      },
      {
       "title": "Move to reject",
       "text": "Unaligned mail is refused. Add `sp=reject` and protect parked domains the same way."
      },
      {
       "title": "Keep operating it",
       "text": "Rotate DKIM keys, review reports monthly and onboard new senders through change control."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Forwarders break SPF because their IP is not in your record, and mailing lists that add footers or subject tags break DKIM. Authenticated Received Chain (ARC) lets trusted intermediaries record the authentication results they saw, and receivers may honour it. Do not respond to forwarding complaints by weakening your policy to p=none.",
     "title": "Forwarding and mailing lists"
    },
    {
     "type": "keypoints",
     "title": "Layered controls beyond authentication",
     "items": [
      "Cloud email security that inspects content, sender history and conversation context",
      "URL rewriting with **time-of-click** checks, because links are often weaponised after delivery",
      "Attachment sandboxing and stripping of risky file types and macros",
      "Lookalike and newly registered domain detection, plus external-sender banners",
      "A one-click report button wired to automated triage and **post-delivery removal**",
      "Phishing-resistant MFA, as covered in the Identity module, so stolen passwords and codes are not enough"
     ]
    },
    {
     "type": "case",
     "title": "Phishing wave at a regional bank",
     "context": "A regional bank with 3,200 staff already enforces `p=reject` on its own domain. At 08:40 on a Monday, 140 employees receive an 'MFA device re-verification' email from `bank-secure-login.example`, a domain registered four days earlier. Within 20 minutes nine people click and two enter their username, password and one-time code on a reverse-proxy page that relays them to the real login portal. The SOC learns of it from three user reports.",
     "questions": [
      "Why did the bank's DMARC policy not block this campaign?",
      "What should the SOC do in the first hour, in order?",
      "Which detections would have caught the campaign earlier?",
      "Which longer-term control removes the value of the stolen credentials?"
     ],
     "answer": "DMARC protects only the bank's own domain; the attacker used a different domain with valid authentication, so every check passed. In the first hour: pull the message from all mailboxes by sender and subject, block the domain and its URLs at the email gateway, web gateway and protective DNS, identify every clicker from proxy and DNS logs, revoke sessions and tokens and reset credentials for the two victims, check sign-in logs for logins from unusual locations and new MFA registrations, and preserve message samples and logs. Earlier detection would come from newly registered and lookalike-domain rules, link analysis at delivery and click time, and correlation of several user reports within minutes. Longer term, phishing-resistant MFA (FIDO2 or certificate-based) defeats relay pages because the authenticator is bound to the real site's origin."
    },
    {
     "type": "scenario",
     "situation": "Marketing has signed with a bulk-email provider and wants campaigns to show `From: offers@bank.example`. The domain is at `p=reject` and SPF already uses nine DNS lookups. What is the best approach?",
     "options": [
      {
       "text": "Have the provider DKIM-sign with a bank.example selector you publish, or send from a subdomain with its own SPF, DKIM and DMARC.",
       "feedback": "Best. DKIM alignment avoids the SPF lookup limit, and a subdomain isolates marketing reputation from transactional mail.",
       "best": true
      },
      {
       "text": "Lower the policy to p=none until the campaign ends, then return to reject once the vendor's mail is no longer needed for marketing.",
       "feedback": "Reopens the domain to spoofing during exactly the period when customers are expecting promotional mail.",
       "best": false
      },
      {
       "text": "Add the provider's include to SPF anyway, because receivers rarely enforce the ten-lookup limit in practice.",
       "feedback": "Exceeding the limit causes SPF permanent errors at receivers, which can break all of the bank's SPF results.",
       "best": false
      },
      {
       "text": "Ask the provider to use its own domain in the From header and add the bank's logo so customers trust it.",
       "feedback": "Training customers to trust brand mail from other domains is exactly the habit phishers exploit.",
       "best": false
      }
     ],
     "title": "A new marketing platform wants to send as the bank"
    },
    {
     "type": "checklist",
     "title": "Email authentication health check",
     "items": [
      "SPF ends in `-all` and stays under 10 DNS lookups",
      "Every legitimate sender DKIM-signs with your domain using keys of at least 2048 bits",
      "DKIM selectors are rotated on a schedule and old keys are removed",
      "DMARC is at `p=reject` with `sp=reject` for subdomains",
      "Aggregate reports are parsed and reviewed at least monthly",
      "Parked domains publish null MX, `v=spf1 -all` and DMARC reject",
      "Lookalike-domain monitoring is in place for your main brands"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "SPF",
       "def": "Sender Policy Framework: a DNS TXT record listing the hosts authorised to send mail for an envelope domain."
      },
      {
       "term": "DKIM",
       "def": "DomainKeys Identified Mail: a cryptographic signature over selected headers and the body, verified with a public key published in DNS."
      },
      {
       "term": "DMARC alignment",
       "def": "The requirement that the domain validated by SPF or DKIM matches the domain in the visible From header."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A message shows `spf=pass` for `mailer.crm-provider.example` and `dkim=none`, with a From address at `bank.example`. The bank publishes `p=reject`. What happens at a DMARC-enforcing receiver?",
       "options": [
        "DMARC passes because SPF passed and DKIM is optional when SPF succeeds",
        "DMARC fails because the passing SPF domain does not align with the From domain",
        "DMARC passes because the CRM provider is a trusted sender for the bank",
        "DMARC is skipped because DKIM returned none rather than an explicit fail"
       ],
       "answer": 1,
       "explain": "DMARC needs SPF or DKIM to pass **with alignment** to the header From domain. SPF passed for an unrelated domain and there is no DKIM, so DMARC fails and the reject policy applies."
      },
      {
       "q": "Which record correctly states that a parked domain sends no email?",
       "options": [
        "v=spf1 -all",
        "v=spf1 +all",
        "v=spf1 ~all mx",
        "v=DKIM1; p=none"
       ],
       "answer": 0,
       "explain": "`v=spf1 -all` authorises no senders and hard-fails everything. `+all` authorises everyone, `~all mx` permits the MX hosts, and an empty DKIM key is not an SPF statement."
      },
      {
       "q": "Why is DKIM alignment usually preferred over SPF alignment for third-party senders?",
       "options": [
        "DKIM encrypts the message body, so content is protected from inspection",
        "DKIM is checked before SMTP starts, so rejected mail never uses bandwidth",
        "DKIM survives forwarding and avoids consuming the SPF ten-lookup budget",
        "DKIM records do not need DNS, so they cannot be broken by zone changes"
       ],
       "answer": 2,
       "explain": "A DKIM signature stays valid across most forwarding and does not count against SPF's DNS lookup limit. DKIM signs, it does not encrypt, and its keys live in DNS."
      },
      {
       "q": "A phishing email from a newly registered lookalike domain passes SPF, DKIM and DMARC. Which control is best placed to catch it?",
       "options": [
        "Raising the bank's own DMARC policy from quarantine to reject",
        "Adding the lookalike domain's IP address to the bank's SPF record",
        "Shortening the TTL on the bank's DMARC record to 300 seconds",
        "Lookalike and new-domain detection combined with link analysis"
       ],
       "answer": 3,
       "explain": "The bank's own records do not govern another domain's mail. Domain-age and lookalike analysis plus URL inspection target exactly this pattern."
      },
      {
       "q": "During DMARC rollout, what is the main purpose of starting at `p=none` with a `rua` address?",
       "options": [
        "To stop spoofed mail immediately while allowing legitimate mail through",
        "To discover every legitimate sender before enforcement can block their mail",
        "To encrypt aggregate reports so only the domain owner can read them",
        "To satisfy receivers that will not accept quarantine as a first policy"
       ],
       "answer": 1,
       "explain": "`p=none` takes no action on failures; it exists to collect aggregate reports so you can fix legitimate senders before quarantine and reject."
      }
     ]
    }
   ]
  },
  {
   "id": "m5-l4",
   "title": "Web, URL Filtering and DNS-Layer Security",
   "subtitle": "Control where users and workloads can go, and use DNS as an early, cheap and universal checkpoint",
   "minutes": 40,
   "objectives": [
    "Design a URL category and reputation policy with a sensible decryption strategy.",
    "Deploy protective DNS with a response policy zone and control encrypted DNS bypass.",
    "Recognise DNS patterns that indicate tunnelling, generated domains and command-and-control."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Most attacks touch the web or DNS at some point: delivering a payload, harvesting credentials, calling home or leaking data. Web and DNS controls see those moments. Module 6 covers the cloud-delivered secure web gateway as part of SSE; here we focus on **policy**: what to allow, block, isolate and decrypt, and how to make DNS itself a detection and prevention layer."
    },
    {
     "type": "layers",
     "title": "Web and DNS defence stack",
     "items": [
      {
       "label": "User and browser",
       "parts": [
        "Managed browser policies",
        "Extension control",
        "Remote browser isolation for risky sites"
       ]
      },
      {
       "label": "URL policy",
       "parts": [
        "Categorisation",
        "Allow, block, warn, isolate",
        "Per-group exceptions"
       ]
      },
      {
       "label": "Reputation and intelligence",
       "parts": [
        "Domain age",
        "Threat feeds",
        "Lookalike detection"
       ]
      },
      {
       "label": "Selective TLS inspection",
       "parts": [
        "Decrypt by risk",
        "Do-not-decrypt for privacy categories",
        "Pinning exceptions"
       ]
      },
      {
       "label": "Content inspection",
       "parts": [
        "Anti-malware",
        "Sandbox",
        "Data loss prevention"
       ]
      },
      {
       "label": "DNS layer",
       "parts": [
        "Protective resolver",
        "Response policy zone",
        "Query logging"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "A starting URL category policy",
     "head": [
      "Category",
      "Action",
      "Rationale"
     ],
     "rows": [
      [
       "Malware, phishing, command-and-control",
       "Block",
       "No business need and high risk"
      ],
      [
       "Newly registered domains (under 30 days)",
       "Block or isolate",
       "Most new domains used in attacks are very young"
      ],
      [
       "Uncategorised",
       "Isolate or warn",
       "Unknown risk; isolation preserves productivity"
      ],
      [
       "Personal webmail and file sharing",
       "Allow, block uploads",
       "Reduces data loss without blocking access"
      ],
      [
       "Finance, health, government",
       "Allow, do not decrypt",
       "Privacy and legal obligations"
      ],
      [
       "Software updates and sanctioned SaaS",
       "Allow, do not decrypt where pinned",
       "Avoids breaking apps that pin certificates"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "TLS inspection is powerful but raises privacy, legal and works-council questions, breaks applications that pin certificates, and turns the inspection CA into a crown jewel. Write a decryption policy that names the categories you decrypt, the ones you never decrypt, who approves exceptions and how the signing key is protected. Log the decision for every session so audits can prove the policy was followed.",
     "title": "Decrypt by risk, not by default"
    },
    {
     "type": "text",
     "text": "**DNS-layer security** uses a protective resolver to refuse or redirect lookups for known-bad or high-risk domains. It acts before any connection is attempted, applies to every protocol and port, needs no decryption and is cheap to run. Its limits are equally clear: malware that connects to hard-coded IP addresses or uses its own encrypted DNS bypasses it, so you must also enforce **which** resolvers devices may use."
    },
    {
     "type": "cli",
     "title": "Protective DNS with a response policy zone",
     "device": "Resolver NS1 · BIND-style configuration",
     "lines": [
      "# named.conf: attach the policy zone to the resolver",
      "options { response-policy { zone \"rpz.corp.example\"; }; };",
      "zone \"rpz.corp.example\" { type primary; file \"db.rpz.corp.example\"; };",
      "# db.rpz.corp.example (SOA and NS records omitted)",
      "malware-c2.example             CNAME .",
      "*.malware-c2.example           CNAME .",
      "login-bank-verify.example      A     192.0.2.80",
      "*.parked-ads.example           CNAME *.",
      "updates.trusted-vendor.example CNAME rpz-passthru."
     ],
     "note": "`CNAME .` returns NXDOMAIN, `CNAME *.` returns an empty answer (NODATA), an A record redirects to a sinkhole or warning page, and `rpz-passthru.` exempts a name from later rules. Wildcards must be listed separately to cover subdomains."
    },
    {
     "type": "steps",
     "title": "Stopping encrypted DNS from bypassing your controls",
     "items": [
      {
       "title": "Allow port 53 only to your resolvers",
       "text": "Block outbound DNS from every other internal host at the edge firewall."
      },
      {
       "title": "Block DNS over TLS",
       "text": "Deny TCP 853 to the internet except from approved resolvers."
      },
      {
       "title": "Control DNS over HTTPS",
       "text": "Block known public DoH endpoints with the web gateway's category and set managed browsers to use the corporate resolver."
      },
      {
       "title": "Answer the browser canary",
       "text": "Return NXDOMAIN for `use-application-dns.net` so browsers that honour it disable automatic DoH."
      },
      {
       "title": "Alert on bypass",
       "text": "Flag hosts that resolve nothing internally yet open many outbound connections."
      }
     ]
    },
    {
     "type": "keypoints",
     "title": "DNS signals worth detecting",
     "items": [
      "Bursts of **NXDOMAIN** answers from one host, typical of domain generation algorithms",
      "Long, high-entropy subdomains and heavy TXT or NULL queries to one domain, typical of DNS tunnelling (T1071.004)",
      "First-seen and newly registered domains, especially right after an email click",
      "Hosts querying external resolvers directly instead of the corporate resolver",
      "Regular, clock-like lookups of the same name from one host, typical of beaconing"
     ]
    },
    {
     "type": "cli",
     "title": "Hunting for tunnelling in DNS logs",
     "device": "Analyst workstation · Zeek dns.log",
     "lines": [
      "$ zeek-cut ts id.orig_h query qtype_name rcode_name < dns.log | awk 'length($3) > 60'",
      "1773480011.21  10.20.7.44  mzxw6ytboi2dqnbsgezdgnjwg44dsmjqgeztk.t.cdn-sync.example  TXT  NOERROR",
      "1773480011.73  10.20.7.44  nbswy3dpeb3w64tmmqqgczlomrqw45lsfzxgk4tf.t.cdn-sync.example  TXT  NOERROR",
      "1773480012.25  10.20.7.44  orsxg5dfeb3w64tmmrxgk5dpnvxwg2lt.t.cdn-sync.example  TXT  NOERROR",
      "$ zeek-cut id.orig_h query < dns.log | grep -c 'cdn-sync.example'",
      "48213"
     ],
     "note": "One host, one parent domain, long base32-looking labels, TXT records and tens of thousands of queries: classic tunnelling indicators. Confirm with the endpoint process that issued them before declaring an incident."
    },
    {
     "type": "scenario",
     "situation": "The hunt above shows workstation 10.20.7.44 sending about two TXT queries per second with encoded subdomains to `cdn-sync.example` for three days. No other host queries the domain. What is the best next action?",
     "options": [
      {
       "text": "Reimage the workstation immediately so the tunnelling software is removed before it can send anything more.",
       "feedback": "Destroys evidence of what was taken and how the host was compromised, and may miss other infected systems.",
       "best": false
      },
      {
       "text": "Keep watching for another week to see what data is being sent before taking any action.",
       "feedback": "Data leaves every second you watch. Observation without containment is rarely justified once exfiltration is likely.",
       "best": false
      },
      {
       "text": "Email the user to ask whether they installed any unusual software recently, and wait for their reply before acting.",
       "feedback": "Slow, may alert an insider and does not stop the channel; user input is useful but should follow containment.",
       "best": false
      },
      {
       "text": "Block the domain at the RPZ, contain the host through EDR, preserve DNS and endpoint data, and search for any other host that has queried the domain.",
       "feedback": "Best. It stops the channel, keeps evidence, limits spread and checks scope across the estate in one coordinated response.",
       "best": true
      }
     ],
     "title": "Possible DNS tunnelling"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Protective DNS",
       "def": "A recursive resolver that refuses or redirects lookups for malicious or high-risk domains and logs every query."
      },
      {
       "term": "Response policy zone (RPZ)",
       "def": "A DNS zone whose records instruct a resolver to rewrite answers, for example to NXDOMAIN or a sinkhole address."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "In a response policy zone, what is the effect of the record `phish.example CNAME .`?",
       "options": [
        "The resolver returns NXDOMAIN for phish.example",
        "The resolver returns an empty answer for phish.example",
        "The resolver forwards phish.example to the root servers",
        "The resolver exempts phish.example from all other policy"
       ],
       "answer": 0,
       "explain": "`CNAME .` means NXDOMAIN, `CNAME *.` means NODATA and `rpz-passthru.` exempts the name. There is no forwarding to the root servers."
      },
      {
       "q": "Why does DNS-layer blocking provide protection for protocols the web gateway never sees?",
       "options": [
        "The resolver decrypts all application traffic after resolving the destination name",
        "DNS blocking installs a host firewall rule on each endpoint that resolves a name",
        "The resolver acts as a transparent proxy for every connection that follows the lookup",
        "Every protocol that uses a domain name must resolve it first, whatever port it uses"
       ],
       "answer": 3,
       "explain": "Resolution happens before a connection on any port. A resolver neither decrypts nor proxies traffic, which is also why direct-to-IP connections bypass it."
      },
      {
       "q": "Which pattern most strongly suggests a domain generation algorithm on an infected host?",
       "options": [
        "A steady daily lookup of the same software update domain at the same hour",
        "Hundreds of NXDOMAIN answers for random-looking domains in a short period",
        "Several lookups of the corporate intranet name immediately after logon",
        "Queries for internal service records issued by the domain controllers"
       ],
       "answer": 1,
       "explain": "DGA malware tries many generated names until one is registered, producing bursts of NXDOMAIN. The other patterns are normal operational traffic."
      },
      {
       "q": "Which action best prevents managed browsers from silently bypassing the protective resolver?",
       "options": [
        "Block all outbound HTTPS traffic except connections to sanctioned SaaS providers",
        "Lower the TTL of every record on the corporate resolver to under 60 seconds",
        "Set browser policy to use the corporate resolver and block public DoH endpoints",
        "Publish DNSSEC signatures for every internal zone so browsers trust the resolver"
       ],
       "answer": 2,
       "explain": "DoH runs over HTTPS, so you control it with browser policy plus endpoint blocking. Blocking all HTTPS is impractical, and TTLs and DNSSEC do not stop bypass."
      },
      {
       "q": "Why should finance and health categories usually be excluded from TLS inspection?",
       "options": [
        "Decrypting them raises privacy and legal concerns that usually outweigh the benefit",
        "These sites never carry malware, so inspecting them only wastes gateway capacity",
        "Their certificates cannot be re-signed because they use stronger key lengths",
        "Inspection of these categories is technically impossible with TLS 1.3"
       ],
       "answer": 0,
       "explain": "The exclusion is a privacy and legal decision. Any site can host malware, key length does not prevent re-signing and TLS 1.3 can be inspected by a forward proxy."
      }
     ]
    }
   ]
  },
  {
   "id": "m5-l5",
   "title": "Endpoint Detection, XDR and Deception",
   "subtitle": "Use endpoint telemetry, cross-domain correlation and decoys to catch what the network cannot see",
   "minutes": 40,
   "objectives": [
    "Distinguish endpoint protection, EDR and XDR by data, analytics and response scope.",
    "Map key endpoint telemetry to ATT&CK techniques and graduated response actions.",
    "Explain deception and honeytokens at concept level, with the guardrails they need."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Encryption and remote work have moved the best vantage point from the wire to the **endpoint** and the **identity provider**. Endpoint detection and response records what processes do, who launched them and what they touched, and it lets responders act on a host in seconds. Extended detection and response (XDR) correlates that with identity, email, network and cloud signals so one incident is shown as one story rather than fifty alerts."
    },
    {
     "type": "compare",
     "title": "EPP, EDR and XDR",
     "columns": [
      {
       "title": "Endpoint protection (EPP)",
       "items": [
        "Prevents known malware and exploits",
        "Signatures, reputation, machine-learning file scoring",
        "Mostly block-or-allow decisions",
        "Little investigation history"
       ]
      },
      {
       "title": "Endpoint detection and response (EDR)",
       "items": [
        "Continuous recording of process, file, registry and network events",
        "Behavioural detections mapped to ATT&CK",
        "Host isolation and remote investigation",
        "Searchable history for hunting"
       ]
      },
      {
       "title": "Extended detection and response (XDR)",
       "items": [
        "Adds identity, email, network and cloud telemetry",
        "Correlates alerts into incidents across domains",
        "Coordinated response across several control points",
        "Value depends on how many sources it really integrates"
       ]
      }
     ]
    },
    {
     "type": "layers",
     "title": "How XDR fuses telemetry",
     "items": [
      {
       "label": "Response",
       "parts": [
        "Isolate host",
        "Revoke session",
        "Purge email",
        "Block indicator"
       ]
      },
      {
       "label": "Correlation and analytics",
       "parts": [
        "Entity graph of user, host and process",
        "Incident grouping",
        "Risk scoring"
       ]
      },
      {
       "label": "Normalised data store",
       "parts": [
        "Common schema",
        "Hot retention for hunting"
       ]
      },
      {
       "label": "Telemetry sources",
       "parts": [
        "Endpoint",
        "Identity provider",
        "Email",
        "Network detection (NDR)",
        "Cloud and SaaS"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Endpoint telemetry that pays for itself",
     "head": [
      "Telemetry",
      "Example signal",
      "ATT&CK technique"
     ],
     "rows": [
      [
       "Process creation with command line",
       "Script interpreter launched by an office application",
       "T1059.001 PowerShell"
      ],
      [
       "Access to the credential store process",
       "Unexpected process reading LSASS memory",
       "T1003.001 LSASS Memory"
      ],
      [
       "Persistence locations",
       "New registry run key or scheduled task",
       "T1547.001 / T1053.005"
      ],
      [
       "Recovery tampering",
       "Shadow copies deleted or backups disabled",
       "T1490 Inhibit System Recovery"
      ],
      [
       "Mass file modification",
       "Hundreds of files rewritten and renamed per minute",
       "T1486 Data Encrypted for Impact"
      ],
      [
       "Network connection by process",
       "Unsigned binary beaconing every 60 seconds",
       "T1071 Application Layer Protocol"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "A critical EDR alert",
     "device": "EDR console · alert export (JSON)",
     "lines": [
      "{",
      "  \"alert\": \"Shadow copy deletion by child of document viewer\",",
      "  \"host\": \"HR-LT-0193\", \"user\": \"CORP\\\\j.mendes\",",
      "  \"process\": \"vssadmin.exe\", \"cmdline\": \"vssadmin delete shadows /all /quiet\",",
      "  \"parent\": \"cmd.exe\", \"grandparent\": \"invoice_viewer.exe\",",
      "  \"attack\": [\"T1490\"], \"severity\": \"critical\",",
      "  \"response\": \"host isolated by policy auto-contain-critical\"",
      "}"
     ],
     "note": "Process lineage is the story: a document viewer spawning a shell that deletes recovery points is a classic precursor to ransomware encryption. Automatic isolation buys time; the analyst now scopes the user, host and any lateral movement."
    },
    {
     "type": "steps",
     "title": "Graduated endpoint response actions",
     "items": [
      {
       "title": "Isolate",
       "text": "Cut the host off from everything except the EDR management channel."
      },
      {
       "title": "Stop",
       "text": "Kill the malicious process tree and quarantine the files involved."
      },
      {
       "title": "Collect",
       "text": "Pull a triage package: running processes, memory image if needed, event logs, autoruns."
      },
      {
       "title": "Block",
       "text": "Push the hash, domain or certificate as an indicator across the fleet."
      },
      {
       "title": "Remediate",
       "text": "Remove persistence, roll back changes where supported, or reimage."
      },
      {
       "title": "Release",
       "text": "Return the host to the network only after validation and a monitoring period."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "Attackers try to stop or blind endpoint agents. Enable tamper protection, require a secret or approval to uninstall, alert when an agent goes silent or its policy changes, and report coverage weekly against the asset inventory. A missing agent is a finding, not a footnote.",
     "title": "Protect the sensor itself"
    },
    {
     "type": "text",
     "text": "**Deception** places assets that no legitimate user or process should ever touch: decoy servers, fake credentials cached on endpoints, canary documents and unused DNS names. Because there is no legitimate reason to interact with them, any interaction is a high-fidelity signal, often appearing early in lateral movement when attackers enumerate and test what they find."
    },
    {
     "type": "framework",
     "title": "Deception building blocks",
     "items": [
      {
       "label": "DCY",
       "title": "Decoy systems",
       "text": "Low-interaction hosts or services that look like real servers on internal segments and alert on any connection."
      },
      {
       "label": "TOK",
       "title": "Honeytokens",
       "text": "Fake credentials, API keys or database rows planted where an attacker would harvest them; any use triggers an alert."
      },
      {
       "label": "DOC",
       "title": "Canary documents",
       "text": "Files that signal home when opened, placed in sensitive shares to reveal browsing and theft."
      },
      {
       "label": "BRD",
       "title": "Breadcrumbs",
       "text": "Pointers such as saved connections or config entries that lead an intruder towards decoys rather than real assets."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Isolate decoys so they can never be used as a stepping stone, keep them free of real data, agree the programme with legal, HR and privacy teams, document who may know where decoys are, and route alerts straight to incident response. Deception is a detection control; it never authorises any action against the intruder's own systems.",
     "title": "Guardrails for deception"
    },
    {
     "type": "scenario",
     "situation": "A fake service-account credential that exists only in the cached credentials of a finance file server is used to attempt a logon to a domain controller from workstation 10.30.2.77 at 02:10. What should the SOC do?",
     "options": [
      {
       "text": "Reset the fake account's password and close the alert, because the account has no real privileges anywhere.",
       "feedback": "The account is harmless; the attacker who harvested it is not. Closing the alert ignores the intrusion it revealed.",
       "best": false
      },
      {
       "text": "Treat it as a confirmed intrusion: contain the source host, find how the credential was harvested and scope lateral movement.",
       "feedback": "Best. A honeytoken has no legitimate use, so this is a high-fidelity indicator that someone harvested credentials from the server.",
       "best": true
      },
      {
       "text": "Open a low-priority ticket for the morning shift, because nothing was actually accessed with the credential.",
       "feedback": "Deception alerts are early warnings. Waiting six hours gives the intruder time to find credentials that do work.",
       "best": false
      },
      {
       "text": "Ask the finance team whether anyone was testing scripts overnight before deciding whether to investigate.",
       "feedback": "No legitimate process should know the honeytoken exists; asking first delays containment for no benefit.",
       "best": false
      }
     ],
     "title": "A honeytoken fires at 02:10"
    },
    {
     "type": "checklist",
     "title": "Endpoint and XDR coverage review",
     "items": [
      "Agent installed and reporting on every managed server, laptop and VDI image",
      "Tamper protection enabled and agent-silence alerts routed to the SOC",
      "Command-line and script-block logging enabled on all hosts",
      "Isolation tested quarterly on a sample of hosts per business unit",
      "Identity, email and cloud sources connected to the XDR or SIEM",
      "Decoys and honeytokens documented, isolated and owned by incident response"
     ]
    },
    {
     "type": "reflection",
     "prompt": "Which of your critical segments could an attacker cross today without generating a single high-fidelity alert? Which combination of endpoint telemetry, network sensing and deception would change that?"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "EDR",
       "def": "Endpoint detection and response: continuous recording of endpoint activity with behavioural detection and remote response actions."
      },
      {
       "term": "XDR",
       "def": "Extended detection and response: correlation and response across endpoint, identity, email, network and cloud telemetry."
      },
      {
       "term": "Honeytoken",
       "def": "A fake credential, key or record with no legitimate use, planted so that any attempt to use it reveals an intruder."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "What most clearly distinguishes EDR from traditional endpoint protection?",
       "options": [
        "Continuous recording of activity with investigation and response actions",
        "The ability to block known malware by file hash before it executes",
        "A larger library of antivirus signatures updated several times a day",
        "Scanning removable media automatically when it is first connected"
       ],
       "answer": 0,
       "explain": "Hash blocking, signature libraries and removable-media scanning are EPP features. EDR adds the recorded history, behavioural detection and host-level response."
      },
      {
       "q": "An XDR platform is connected only to endpoints. What is the main consequence?",
       "options": [
        "It cannot isolate hosts because isolation requires a network sensor",
        "It cannot use ATT&CK mappings because those need email telemetry",
        "It cannot keep any historical data without a separate SIEM licence",
        "It cannot join identity, email or cloud events into one incident"
       ],
       "answer": 3,
       "explain": "XDR's value is cross-domain correlation. With only endpoint data it behaves like EDR; host isolation and ATT&CK mapping still work."
      },
      {
       "q": "A document viewer spawns `cmd.exe`, which runs `vssadmin delete shadows /all /quiet`. Which technique is this?",
       "options": [
        "T1003 OS Credential Dumping",
        "T1566.001 Spearphishing Attachment",
        "T1490 Inhibit System Recovery",
        "T1021 Remote Services"
       ],
       "answer": 2,
       "explain": "Deleting shadow copies removes recovery points, mapped to T1490 and often seen just before encryption (T1486)."
      },
      {
       "q": "Why do honeytokens produce high-fidelity alerts?",
       "options": [
        "They are protected by stronger encryption than real credentials",
        "No legitimate user or process has any reason to use them",
        "They are monitored by a separate SOC with more experienced staff",
        "They only trigger when malware with a known signature uses them"
       ],
       "answer": 1,
       "explain": "Fidelity comes from the absence of legitimate use. Any interaction is suspicious by design, whatever tool the intruder uses."
      },
      {
       "q": "Which practice is essential when deploying decoy servers?",
       "options": [
        "Copying real customer data into them so the decoys look convincing",
        "Announcing their addresses to all staff so nobody connects by mistake",
        "Isolating them so they cannot be used as a stepping stone to real systems",
        "Configuring them to scan back any host that connects to them"
       ],
       "answer": 2,
       "explain": "Decoys must never become a pivot, must contain no real data and must not take action against connecting hosts. Their location is need-to-know."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m6",
 "order": 6,
 "code": "Cloud",
 "title": "Cloud — Cloud, SASE & SSE",
 "subtitle": "Secure what you own in the cloud and deliver security from the cloud to every user, branch and application.",
 "outcomes": [
  "Allocate cloud security responsibilities correctly and design layered cloud network controls.",
  "Use posture management and guardrails to find and prevent misconfiguration.",
  "Design SASE and SSE services, choosing steering methods and CASB modes for each risk.",
  "Replace network-level remote access with ZTNA and redesign branches for direct-to-cloud.",
  "Protect SaaS tenants and APIs against misconfiguration, consent abuse and authorisation flaws."
 ],
 "lessons": [
  {
   "id": "m6-l1",
   "title": "Shared Responsibility and Cloud Network Controls",
   "subtitle": "Know exactly what you own in each service model, then build and police cloud network boundaries",
   "minutes": 40,
   "objectives": [
    "Allocate security duties correctly across IaaS, PaaS and SaaS.",
    "Contrast security groups and network ACLs and combine them in a tiered design.",
    "Explain how cloud posture management finds and prevents misconfiguration."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "In the cloud the provider secures the infrastructure you cannot touch, and you secure everything you configure. Most cloud breaches are not provider failures; they are customer misconfigurations such as a public storage bucket, an over-privileged role or a management port open to the world. The **Cloud** layer of the stack starts with an exact map of who owns what."
    },
    {
     "type": "table",
     "title": "Shared responsibility by service model",
     "head": [
      "Layer",
      "IaaS",
      "PaaS",
      "SaaS"
     ],
     "rows": [
      [
       "Data and its classification",
       "Customer",
       "Customer",
       "Customer"
      ],
      [
       "Identities, roles and access policy",
       "Customer",
       "Customer",
       "Customer"
      ],
      [
       "Application code and configuration",
       "Customer",
       "Customer",
       "Provider code, customer settings"
      ],
      [
       "Guest operating system and patching",
       "Customer",
       "Provider",
       "Provider"
      ],
      [
       "Virtual network controls",
       "Customer",
       "Shared",
       "Provider"
      ],
      [
       "Hypervisor, hardware, physical sites",
       "Provider",
       "Provider",
       "Provider"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Whatever the model, you always own your **data**, your **identities** and your **configuration choices**. A provider can give you encryption, logging and guardrails, but you decide whether they are switched on and who can change them.",
     "title": "Three things never move to the provider"
    },
    {
     "type": "compare",
     "title": "Security groups versus network ACLs",
     "columns": [
      {
       "title": "Security group",
       "items": [
        "Attached to an instance or network interface",
        "**Stateful**: return traffic is allowed automatically",
        "Typically allow rules only; anything unmatched is denied",
        "All rules evaluated together",
        "Can reference other groups instead of IP ranges"
       ]
      },
      {
       "title": "Network ACL",
       "items": [
        "Applied at the subnet boundary",
        "**Stateless**: return traffic needs its own rule, often ephemeral ports",
        "Allow **and** deny rules",
        "Evaluated in numbered order, first match wins",
        "Good for coarse blocks such as denying a hostile range"
       ]
      }
     ]
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "The comparison above describes the most common cloud model. Some providers let security groups include deny rules and priorities, or call them network security groups. Always confirm statefulness, evaluation order and default behaviour in the platform you are designing for.",
     "title": "A note on providers"
    },
    {
     "type": "cli",
     "title": "A three-tier boundary as provider-neutral policy",
     "device": "Cloud policy file · network.yaml (illustrative)",
     "lines": [
      "security_groups:",
      "  sg-web: { ingress: [ {proto: tcp, port: 443, source: sg-lb} ] }",
      "  sg-app: { ingress: [ {proto: tcp, port: 8443, source: sg-web} ] }",
      "  sg-db:  { ingress: [ {proto: tcp, port: 5432, source: sg-app} ] }",
      "network_acls:",
      "  nacl-db-subnet:",
      "    inbound:",
      "      - {rule: 100, proto: tcp, port: 5432, cidr: 10.60.2.0/24, action: allow}",
      "      - {rule: 900, proto: all, cidr: 0.0.0.0/0, action: deny}",
      "    outbound:",
      "      - {rule: 100, proto: tcp, ports: 1024-65535, cidr: 10.60.2.0/24, action: allow}",
      "      - {rule: 900, proto: all, cidr: 0.0.0.0/0, action: deny}"
     ],
     "note": "Security groups chain tiers by **group reference**, so scaling out never requires an IP change. The stateless subnet ACL needs an explicit outbound rule for return traffic on ephemeral ports back to the app subnet."
    },
    {
     "type": "flow",
     "title": "Inbound path to a cloud workload",
     "items": [
      {
       "label": "Internet"
      },
      {
       "label": "Edge protection",
       "text": "DDoS mitigation and web application firewall"
      },
      {
       "label": "Load balancer",
       "text": "TLS termination and health checks"
      },
      {
       "label": "Network ACL",
       "text": "Stateless subnet filter"
      },
      {
       "label": "Security group",
       "text": "Stateful per-interface filter"
      },
      {
       "label": "Workload",
       "text": "Host firewall and application controls"
      }
     ]
    },
    {
     "type": "text",
     "text": "**Cloud security posture management (CSPM)** continuously reads the configuration of every account and subscription and compares it with policy and benchmarks: public storage, unencrypted volumes, missing logging, open management ports, unused keys. Mature programmes go further, scanning infrastructure-as-code before deployment and applying **preventive guardrails** at the organisation level so certain mistakes cannot be made at all. Platforms that merge these functions are often called cloud-native application protection platforms (CNAPP)."
    },
    {
     "type": "table",
     "title": "The cloud posture family",
     "head": [
      "Capability",
      "Focus",
      "Typical finding"
     ],
     "rows": [
      [
       "CSPM",
       "Configuration of cloud resources",
       "Storage bucket readable by anyone"
      ],
      [
       "CIEM",
       "Cloud identities and entitlements",
       "Role with wildcard permissions unused for 90 days"
      ],
      [
       "CWPP",
       "Workloads: VMs, containers, serverless",
       "Container image with a critical vulnerability"
      ],
      [
       "IaC scanning",
       "Templates before deployment",
       "Template opens port 22 to 0.0.0.0/0"
      ],
      [
       "DSPM",
       "Where sensitive data lives and who can reach it",
       "Customer records copied into a test account"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "A posture finding",
     "device": "Posture console · finding export (JSON)",
     "lines": [
      "{",
      "  \"finding\": \"Object storage allows public read\",",
      "  \"resource\": \"bucket/hr-exports-2026\", \"account\": \"prod-hr\",",
      "  \"severity\": \"high\", \"control\": \"DS-03 Data stores must not be public\",",
      "  \"first_seen\": \"2026-06-02T07:14:00Z\", \"data_classification\": \"confidential\",",
      "  \"remediation\": \"Enable account-level public access block; remove public grant\"",
      "}"
     ]
    },
    {
     "type": "scenario",
     "situation": "A developer opened TCP 22 from 0.0.0.0/0 on a production security group to troubleshoot a failing deployment. The posture tool flagged it 30 minutes later. What is the best response?",
     "options": [
      {
       "text": "Remove the rule, give engineers brokered just-in-time access, and add a guardrail that blocks internet-facing management ports.",
       "feedback": "Best. It fixes the exposure, meets the real need for access through a controlled path, and prevents the same mistake recurring.",
       "best": true
      },
      {
       "text": "Leave the rule but restrict it to the developer's current home IP address so troubleshooting can continue.",
       "feedback": "Narrower, but home IPs change, the rule will be forgotten and the root cause (no safe access path) remains.",
       "best": false
      },
      {
       "text": "Delete the developer's cloud access and report the incident to HR as a policy violation.",
       "feedback": "Punishing an engineer who lacked a safe access path does not fix the design and discourages people from reporting mistakes.",
       "best": false
      },
      {
       "text": "Raise the posture tool's alert threshold so that temporary troubleshooting rules no longer generate any high-severity findings at all.",
       "feedback": "Silences the control that worked. Management ports open to the internet are scanned within minutes.",
       "best": false
      }
     ],
     "title": "SSH open to the world"
    },
    {
     "type": "checklist",
     "title": "Cloud network baseline",
     "items": [
      "No management ports (22, 3389, database ports) reachable from the internet",
      "Security groups reference other groups rather than broad CIDR ranges",
      "Flow logs enabled on every production network and sent to the SIEM",
      "Organisation-level guardrails block public storage and unencrypted volumes",
      "Infrastructure-as-code scanned in the pipeline before deployment",
      "Posture findings have owners and remediation deadlines by severity"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Shared responsibility model",
       "def": "The division of security duties between a cloud provider and its customer, which varies by IaaS, PaaS and SaaS."
      },
      {
       "term": "Security group",
       "def": "A stateful, per-interface virtual firewall in a cloud network, usually allow-only."
      },
      {
       "term": "CSPM",
       "def": "Cloud security posture management: continuous comparison of cloud configuration with policy and benchmarks."
      },
      {
       "term": "CNAPP",
       "def": "Cloud-native application protection platform: a consolidated platform combining posture, workload, identity and code-scanning functions."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A database subnet's network ACL allows inbound TCP 5432 from the app subnet but has no outbound allow rule. Security groups are correct. What happens?",
       "options": [
        "Connections fail because the stateless ACL drops the database's return traffic",
        "Connections succeed because the security group's state covers the subnet ACL as well",
        "Connections succeed because ACLs only evaluate traffic from the internet",
        "Connections fail because security groups cannot reference database ports"
       ],
       "answer": 0,
       "explain": "ACLs are stateless, so the reply on ephemeral ports needs an explicit outbound rule. Security group state does not extend to the subnet ACL."
      },
      {
       "q": "In a PaaS database service, who is normally responsible for patching the database engine's operating system?",
       "options": [
        "The customer",
        "The provider",
        "The customer's auditor",
        "The application developer"
       ],
       "answer": 1,
       "explain": "In PaaS the provider runs and patches the platform. The customer still owns data, access policy and service configuration."
      },
      {
       "q": "Why should tiers be linked by security group references rather than IP ranges?",
       "options": [
        "Group references are evaluated before network ACLs",
        "Group references encrypt traffic between the tiers",
        "Group references remove the need for any subnet ACLs",
        "Rules stay valid as instances scale and move"
       ],
       "answer": 3,
       "explain": "Referencing a group follows its members wherever they are and however many there are. It neither changes evaluation order nor adds encryption."
      },
      {
       "q": "Which control prevents a misconfiguration rather than only detecting it?",
       "options": [
        "A posture scan that reports public storage within thirty minutes",
        "An organisation guardrail that denies creating public storage",
        "A monthly report of every storage bucket and its access settings",
        "A SIEM alert raised when a public bucket is read by an outsider"
       ],
       "answer": 1,
       "explain": "Guardrails stop the change from being made. Scans, reports and alerts all act after the exposure already exists."
      },
      {
       "q": "A posture tool flags a role with wildcard permissions that has not been used for 90 days. Which capability produced the finding?",
       "options": [
        "CWPP",
        "DSPM",
        "WAAP",
        "CIEM"
       ],
       "answer": 3,
       "explain": "Cloud infrastructure entitlement management analyses identities and permissions, including unused privilege. CWPP protects workloads, DSPM tracks data and WAAP protects web apps and APIs."
      }
     ]
    }
   ]
  },
  {
   "id": "m6-l2",
   "title": "SASE and SSE: Architecture, Secure Web Gateway and CASB",
   "subtitle": "Deliver security as a cloud service close to users, and govern how they use SaaS",
   "minutes": 40,
   "objectives": [
    "Distinguish SASE from SSE and list the services each includes.",
    "Choose traffic-steering methods for a cloud secure web gateway.",
    "Select CASB API, forward-proxy and reverse-proxy modes for specific risks.",
    "Capture a SASE design in a reusable design sheet."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "When users, applications and data left the data centre, the old model of hauling all traffic back to a central firewall stack became slow and expensive. **Secure access service edge (SASE)** converges wide-area networking with cloud-delivered security so policy is applied at a nearby point of presence. **Security service edge (SSE)** is the security half of SASE on its own, for organisations that keep their existing WAN or buy networking separately."
    },
    {
     "type": "compare",
     "title": "SASE versus SSE",
     "columns": [
      {
       "title": "SASE",
       "items": [
        "Networking **and** security as one service",
        "SD-WAN, routing and WAN optimisation",
        "Plus SWG, CASB, ZTNA, FWaaS and DLP",
        "One policy model from branch to cloud",
        "Best fit for WAN refresh or greenfield sites"
       ]
      },
      {
       "title": "SSE",
       "items": [
        "Security services only",
        "SWG, CASB, ZTNA, usually FWaaS and DLP",
        "Works with any existing WAN or SD-WAN",
        "Faster to adopt for remote users",
        "Common first step towards full SASE"
       ]
      }
     ]
    },
    {
     "type": "layers",
     "title": "SASE reference architecture",
     "items": [
      {
       "label": "Policy and analytics",
       "parts": [
        "Single policy engine",
        "Unified logging",
        "Risk scoring"
       ]
      },
      {
       "label": "Security service edge",
       "parts": [
        "Secure web gateway",
        "CASB",
        "ZTNA",
        "Firewall as a service",
        "Data loss prevention"
       ]
      },
      {
       "label": "Global points of presence",
       "parts": [
        "Inspection close to users",
        "Dedicated egress IPs",
        "Peering with SaaS providers"
       ]
      },
      {
       "label": "Networking",
       "parts": [
        "SD-WAN",
        "Path selection",
        "WAN optimisation"
       ]
      },
      {
       "label": "On-ramps",
       "parts": [
        "Endpoint agent",
        "Branch tunnels",
        "App connectors",
        "Proxy settings"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "Steering traffic to a cloud secure web gateway",
     "head": [
      "Method",
      "Strength",
      "Limitation"
     ],
     "rows": [
      [
       "Endpoint agent",
       "Follows the user anywhere; steers all ports; reports device posture",
       "Needs deployment on every managed device"
      ],
      [
       "IPsec or GRE tunnel from the branch",
       "No endpoint change; covers IoT and guests",
       "Only protects users while they are on site"
      ],
      [
       "PAC file or explicit proxy",
       "Simple and agentless for browsers",
       "Non-browser apps often ignore it; easy to bypass"
      ],
      [
       "Proxy chaining from an on-premises proxy",
       "Reuses existing investment during migration",
       "Hides the real client IP unless headers are forwarded"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "A proxy auto-configuration file",
     "device": "PAC file · proxy.pac",
     "lines": [
      "function FindProxyForURL(url, host) {",
      "  if (isPlainHostName(host) || dnsDomainIs(host, \".corp.example\"))",
      "    return \"DIRECT\";",
      "  if (isInNet(host, \"10.0.0.0\", \"255.0.0.0\"))",
      "    return \"DIRECT\";",
      "  return \"PROXY gw1.sse.example:8080; PROXY gw2.sse.example:8080\";",
      "}"
     ],
     "note": "Internal names and private addresses go direct; everything else uses the nearest gateway, falling back to a second point of presence. A PAC file only steers applications that honour it, which is why agents or tunnels are preferred for full coverage."
    },
    {
     "type": "compare",
     "title": "CASB deployment modes",
     "columns": [
      {
       "title": "API mode (out of band)",
       "items": [
        "Connects to sanctioned SaaS through the provider's API",
        "Scans data at rest and sharing settings",
        "Works for any device, no latency",
        "Acts after the fact, not in real time"
       ]
      },
      {
       "title": "Inline forward proxy",
       "items": [
        "Traffic from managed devices via agent or tunnel",
        "Real-time control of uploads and downloads",
        "Sees unsanctioned (shadow) SaaS",
        "Requires TLS inspection"
       ]
      },
      {
       "title": "Inline reverse proxy",
       "items": [
        "Identity provider redirects sessions to the proxy",
        "Controls unmanaged devices on sanctioned apps",
        "No agent needed",
        "URL rewriting can break complex apps"
       ]
      }
     ]
    },
    {
     "type": "table",
     "title": "What a CASB is used for",
     "head": [
      "Use case",
      "Typical control"
     ],
     "rows": [
      [
       "Shadow IT discovery",
       "Analyse proxy and firewall logs to find unsanctioned apps and rate their risk"
      ],
      [
       "Data protection",
       "DLP on uploads, downloads and sharing; label-aware policies"
      ],
      [
       "Tenant restriction",
       "Allow the corporate tenant of a SaaS app but block personal tenants of the same app"
      ],
      [
       "Threat protection",
       "Detect impossible travel, mass downloads and malware in shared files"
      ],
      [
       "Compliance",
       "Report on data location, sharing and admin activity"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "Blocking a file-sharing domain is easy; allowing the corporate tenant while blocking personal accounts on the **same** domain is harder. Inline proxies solve it by inserting tenant-restriction headers or inspecting login requests, so staff cannot copy data from the corporate tenant to a personal one through an approved app.",
     "title": "Tenant restrictions close a common gap"
    },
    {
     "type": "scenario",
     "situation": "Two hundred contractors must use the corporate CRM from their own laptops. Security wants them to view and edit records but never download customer exports. No agent can be installed. What is the best control?",
     "options": [
      {
       "text": "Rely on API-mode CASB to find exported files in the CRM and delete them after each download.",
       "feedback": "API mode acts after the fact; by the time it sees an export the file is already on an unmanaged laptop.",
       "best": false
      },
      {
       "text": "Require contractors to connect through the corporate remote-access VPN and inspect traffic at the data centre.",
       "feedback": "A VPN on unmanaged devices extends the network to untrusted hosts and still cannot stop a browser download.",
       "best": false
      },
      {
       "text": "Use identity-provider conditional access to route contractor sessions through a reverse-proxy CASB that allows browsing and blocks downloads.",
       "feedback": "Best. Reverse proxy needs no agent, applies in real time and is designed for exactly this unmanaged-device case.",
       "best": true
      },
      {
       "text": "Publish a policy forbidding downloads and ask each contractor to sign it before access is granted.",
       "feedback": "Policy without technical enforcement relies entirely on good behaviour and gives no visibility.",
       "best": false
      }
     ],
     "title": "Contractors on unmanaged laptops"
    },
    {
     "type": "template",
     "title": "SASE design sheet",
     "purpose": "Record, per user group or site, how traffic reaches the security edge and which services and policies apply.",
     "columns": [
      "User group or site",
      "On-ramp",
      "Services applied",
      "Point of presence and egress",
      "Key policies",
      "Fallback if the PoP fails"
     ],
     "example": [
      [
       "Branch retail stores (120 sites)",
       "Dual IPsec tunnels from SD-WAN edge",
       "SWG, FWaaS, DNS security, IPS",
       "Two nearest PoPs; dedicated egress IP pair",
       "Block uncategorised; POS VLAN allowed to payment processor only",
       "Fail over to second PoP; fail closed for POS VLAN"
      ]
     ],
     "rows": 6
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "SASE",
       "def": "Secure access service edge: wide-area networking and security delivered together as a cloud service."
      },
      {
       "term": "SSE",
       "def": "Security service edge: the cloud-delivered security services of SASE (SWG, CASB, ZTNA, often FWaaS and DLP) without the networking."
      },
      {
       "term": "CASB",
       "def": "Cloud access security broker: visibility and control over SaaS use through API integration and inline proxies."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A company is keeping its existing SD-WAN contract for five more years but needs cloud-delivered web security and ZTNA now. What should it adopt?",
       "options": [
        "Full single-vendor SASE, replacing the SD-WAN",
        "A larger data-centre firewall cluster",
        "SSE, integrated with the existing SD-WAN",
        "Remote-access VPN with split tunnelling"
       ],
       "answer": 2,
       "explain": "SSE delivers the security services without replacing networking, which fits an organisation committed to its current WAN."
      },
      {
       "q": "Which steering method best protects laptops when users work from hotels and homes?",
       "options": [
        "An endpoint agent tunnelling to the nearest PoP",
        "IPsec tunnels from every branch office router to two PoPs",
        "A PAC file hosted on an internal web server",
        "Proxy chaining from the data-centre proxy"
       ],
       "answer": 0,
       "explain": "Only the agent travels with the device. Branch tunnels cover on-site users, and an internal PAC file is unreachable off network."
      },
      {
       "q": "You need to find sensitive files already shared publicly in the corporate SaaS storage. Which CASB mode fits best?",
       "options": [
        "Forward proxy, inspecting new uploads in real time",
        "Reverse proxy, rewriting the app's URLs per session",
        "API mode, scanning data at rest and its sharing",
        "Packet capture at the internet edge firewall"
       ],
       "answer": 2,
       "explain": "Existing data at rest is only visible through the provider API. Inline modes see new traffic, and the edge sees encrypted sessions only."
      },
      {
       "q": "What does a tenant-restriction control achieve?",
       "options": [
        "It limits each user to a fixed number of SaaS applications per working day",
        "It allows the corporate instance of a SaaS app while blocking personal instances",
        "It forces SaaS providers to store tenant data in the customer's own region",
        "It prevents administrators from creating new tenants in the identity provider"
       ],
       "answer": 1,
       "explain": "Tenant restriction distinguishes tenants on the same domain, closing a path for copying corporate data to personal accounts."
      },
      {
       "q": "Why is a PAC file alone insufficient for full SWG coverage?",
       "options": [
        "Many non-browser apps ignore proxy settings and connect directly",
        "PAC files cannot list more than one proxy server for failover purposes",
        "PAC files force all traffic through the proxy, including internal sites",
        "PAC files only work with IPv6 destinations and modern browsers"
       ],
       "answer": 0,
       "explain": "Proxy auto-configuration is honoured mainly by browsers. PAC files can list fallbacks and send internal traffic direct, as the example shows."
      }
     ]
    }
   ]
  },
  {
   "id": "m6-l3",
   "title": "ZTNA versus VPN and Branch-to-Cloud Design",
   "subtitle": "Replace network-level remote access with per-application access, and redesign branches for a cloud-first world",
   "minutes": 40,
   "objectives": [
    "Contrast ZTNA with remote-access VPN on exposure, trust and lateral-movement risk.",
    "Describe the ZTNA connection flow and write an application access policy.",
    "Design branch-to-cloud connectivity with local breakout through a security edge."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "A remote-access VPN puts a device **on the network**; after login it can usually reach far more than its user needs, and the concentrator itself must listen on the internet. Zero trust network access (ZTNA) inverts this: users are connected to **specific applications**, never to networks, and applications are reached through connectors that only make outbound connections. Module 3 covered VPN design in depth; here we decide when ZTNA should replace it."
    },
    {
     "type": "compare",
     "title": "Remote-access VPN versus ZTNA",
     "columns": [
      {
       "title": "Remote-access VPN",
       "items": [
        "Grants network-level access after login",
        "Concentrator exposed on the internet",
        "Lateral movement possible within allowed subnets",
        "Trust decided mostly at connection time",
        "Familiar, works for any protocol"
       ]
      },
      {
       "title": "ZTNA",
       "items": [
        "Grants access to named applications only",
        "Applications hidden behind outbound-only connectors",
        "No network presence to move laterally from",
        "Identity, device and context checked per request",
        "Some legacy and peer-to-peer protocols need extra work"
       ]
      }
     ]
    },
    {
     "type": "flow",
     "title": "A ZTNA session from request to revocation",
     "items": [
      {
       "label": "Authenticate",
       "text": "User signs in to the identity provider with phishing-resistant MFA"
      },
      {
       "label": "Assess device",
       "text": "Agent reports posture: managed, encrypted, EDR running, patched"
      },
      {
       "label": "Decide",
       "text": "Policy engine evaluates user, device, application and risk"
      },
      {
       "label": "Broker",
       "text": "Service stitches the session to the app connector's outbound tunnel"
      },
      {
       "label": "Monitor",
       "text": "Signals are re-evaluated during the session"
      },
      {
       "label": "Revoke",
       "text": "Session ends if risk rises or posture fails"
      }
     ]
    },
    {
     "type": "table",
     "title": "ZTNA delivery models",
     "head": [
      "Model",
      "Best for",
      "Watch out for"
     ],
     "rows": [
      [
       "Agent-based",
       "Managed devices; any TCP or UDP application; strong posture checks",
       "Agent rollout and support effort"
      ],
      [
       "Agentless (browser-based)",
       "Web apps, SSH or RDP in browser, unmanaged and partner devices",
       "Limited posture data; browser-only protocols"
      ],
      [
       "Self-hosted broker",
       "Data-sovereignty or air-gapped requirements",
       "You operate availability and scaling yourself"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "A per-application access policy",
     "device": "ZTNA policy · payroll.yaml (illustrative)",
     "lines": [
      "application: payroll-web",
      "  fqdn: payroll.corp.example",
      "  port: 443",
      "  connector_group: dc-east-connectors",
      "access_rules:",
      "  - name: payroll-staff",
      "    allow_groups: [hr-payroll]",
      "    require:",
      "      mfa: phishing_resistant",
      "      device: {managed: true, disk_encrypted: true, edr_running: true}",
      "    session: {max_hours: 8, reevaluate_on_risk_change: true}",
      "  - name: default",
      "    action: deny"
     ],
     "note": "Access names an application, a group and conditions, never a subnet. The final default-deny rule makes the policy explicit and auditable."
    },
    {
     "type": "layers",
     "title": "Branch-to-cloud architecture",
     "items": [
      {
       "label": "Destinations",
       "parts": [
        "SaaS",
        "IaaS workloads",
        "Data-centre apps via connectors"
       ]
      },
      {
       "label": "Security edge PoPs",
       "parts": [
        "SWG",
        "CASB",
        "FWaaS",
        "ZTNA broker",
        "DNS security"
       ]
      },
      {
       "label": "Transport",
       "parts": [
        "Dual internet links",
        "Cellular backup",
        "Optional private circuit"
       ]
      },
      {
       "label": "Branch edge",
       "parts": [
        "SD-WAN appliance",
        "Local breakout policy",
        "Segmented VLANs"
       ]
      },
      {
       "label": "Users and devices",
       "parts": [
        "Staff",
        "Guests",
        "IoT and point-of-sale"
       ]
      }
     ]
    },
    {
     "type": "steps",
     "title": "Moving a branch estate from backhaul to direct-to-cloud",
     "items": [
      {
       "title": "Measure flows",
       "text": "Classify branch traffic into SaaS, general internet, private apps and real-time media."
      },
      {
       "title": "Define breakout classes",
       "text": "SaaS and internet go to the nearest PoP; private apps go through ZTNA; trusted media may go direct but logged."
      },
      {
       "title": "Build redundant on-ramps",
       "text": "Two tunnels from each branch to two PoPs, with health checks and tested failover."
      },
      {
       "title": "Replace site-to-DC routing",
       "text": "Publish data-centre apps through connectors instead of routing branches into the DC."
      },
      {
       "title": "Pilot and phase",
       "text": "Start with a few low-risk sites, measure user experience, then roll out in waves."
      },
      {
       "title": "Retire legacy",
       "text": "Decommission backhaul circuits and VPN concentrators once usage reaches zero."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "SaaS apps that allow-list source IPs need your **dedicated egress addresses**; geolocation may show the PoP's country rather than the user's; voice and video suffer if forced through inspection; split DNS must resolve private names for ZTNA and public names for the gateway. Discover these in the pilot, not during the cut-over weekend.",
     "title": "What usually breaks"
    },
    {
     "type": "scenario",
     "situation": "A retailer backhauls 40 branches over private circuits to one data centre, where a firewall stack inspects all internet traffic. Seventy per cent of traffic is SaaS, users complain of slow video calls, and the circuits are up for renewal. What is the best direction?",
     "options": [
      {
       "text": "Renew the private circuits at higher bandwidth and add a second firewall cluster in the data centre.",
       "feedback": "Spends more to preserve the hairpin that causes the latency; SaaS traffic still travels twice as far.",
       "best": false
      },
      {
       "text": "Give every branch direct internet access with a basic router and rely on endpoint antivirus for all of its protection needs.",
       "feedback": "Fixes latency by removing inspection, DNS security and data protection, trading performance for exposure.",
       "best": false
      },
      {
       "text": "Move all branch users onto remote-access VPN clients that connect to the data centre.",
       "feedback": "Still backhauls everything and adds VPN overhead; it changes the client, not the architecture.",
       "best": false
      },
      {
       "text": "Adopt SD-WAN with local breakout to a security edge, publish data-centre apps through ZTNA, and retire most private circuits.",
       "feedback": "Best. It removes the hairpin for the dominant SaaS traffic, keeps inspection, and narrows data-centre access to named applications.",
       "best": true
      }
     ],
     "title": "Forty branches, one data centre"
    },
    {
     "type": "checklist",
     "title": "ZTNA readiness",
     "items": [
      "Application inventory with owners, users and protocols",
      "Identity provider with phishing-resistant MFA for all ZTNA users",
      "Device posture signals available (management, encryption, EDR, patch level)",
      "Connectors deployed in pairs per site with outbound-only connectivity",
      "Default-deny policy with per-application allow rules reviewed by owners",
      "Plan for legacy, server-initiated and peer-to-peer protocols"
     ]
    },
    {
     "type": "reflection",
     "prompt": "List three applications your users reach today through a remote-access VPN. For each, would ZTNA, a reverse proxy or keeping the VPN be the right answer, and why?"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "ZTNA",
       "def": "Zero trust network access: brokered, per-application access granted after identity, device and context checks, with applications hidden from the internet."
      },
      {
       "term": "App connector",
       "def": "A lightweight component near private applications that makes outbound-only connections to a ZTNA broker."
      },
      {
       "term": "Local breakout",
       "def": "Sending branch traffic for internet and SaaS directly from the branch, usually to a nearby security edge, instead of backhauling it."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Why does ZTNA reduce lateral-movement risk compared with a remote-access VPN?",
       "options": [
        "ZTNA encrypts traffic with stronger ciphers, so attackers cannot read data on the network",
        "ZTNA requires a faster internet link, so attackers cannot keep a stable connection",
        "ZTNA logs every packet, so attackers are always detected before they can move",
        "Users reach named apps, so a compromised device has no network presence to move from"
       ],
       "answer": 3,
       "explain": "The key difference is the access model: application-level brokering instead of network-level connectivity. Encryption strength and logging are not the main reason."
      },
      {
       "q": "Why do ZTNA app connectors make only outbound connections?",
       "options": [
        "So the private applications need no inbound internet exposure at all",
        "So the connectors can bypass the data-centre firewall's inspection rules",
        "So users can connect directly to connectors without authenticating first",
        "So connectors can run without any network connectivity to the apps"
       ],
       "answer": 0,
       "explain": "Outbound-only connectors let you close inbound ports, hiding applications from internet scanning."
      },
      {
       "q": "A SaaS provider allow-lists your old data-centre public IPs. After moving branches to a security edge, access fails. What is the fix?",
       "options": [
        "Disable inspection for that SaaS application at every point of presence",
        "Register the edge's dedicated egress IPs with the SaaS provider",
        "Route that SaaS application's traffic back through a remote-access VPN",
        "Ask users to sign in again so the SaaS provider refreshes its records"
       ],
       "answer": 1,
       "explain": "Traffic now egresses from the PoP, so the allow list must include your dedicated PoP egress addresses."
      },
      {
       "q": "Which delivery model best fits partners using their own laptops to reach one internal web portal?",
       "options": [
        "Agent-based ZTNA with full posture",
        "Site-to-site IPsec to each partner",
        "Full-tunnel remote-access VPN",
        "Agentless browser-based ZTNA"
       ],
       "answer": 3,
       "explain": "You cannot install agents on partner devices, and network-level access is excessive for one portal. Browser-based ZTNA publishes just that app."
      },
      {
       "q": "In the access policy example, what is the purpose of the final `default` rule with `action: deny`?",
       "options": [
        "It allows every user who is not in the payroll group to log in",
        "It records denied attempts but still allows the session to start",
        "It makes default-deny explicit so anything unmatched is refused",
        "It sets the default session length for users of the payroll app"
       ],
       "answer": 2,
       "explain": "An explicit catch-all deny documents the intended behaviour and protects against platform defaults that might allow unmatched requests."
      }
     ]
    }
   ]
  },
  {
   "id": "m6-l4",
   "title": "Securing SaaS and APIs",
   "subtitle": "Govern SaaS configuration, sharing and third-party apps, and protect the APIs your business runs on",
   "minutes": 40,
   "objectives": [
    "Identify the main SaaS risks and the controls that address them.",
    "Apply the OWASP API Security Top 10 to gateway and application design.",
    "Investigate and contain a SaaS data exposure."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "SaaS moved the data centre into other people's applications, and APIs became the way every system talks to every other. Both are attacked through **configuration and authorisation** rather than through classic network exploits: an over-shared folder, a third-party app with excessive consent, an API that trusts a customer ID in the URL. Network controls still help, but most protection here comes from identity, posture and application logic."
    },
    {
     "type": "table",
     "title": "SaaS risks and their controls",
     "head": [
      "Risk",
      "Example",
      "Control"
     ],
     "rows": [
      [
       "Misconfiguration",
       "Guest access enabled tenant-wide",
       "SaaS security posture management (SSPM)"
      ],
      [
       "Over-sharing",
       "Folder shared as 'anyone with the link'",
       "Sharing restrictions plus API-mode DLP"
      ],
      [
       "Risky third-party apps",
       "Unvetted app granted read access to all mail",
       "Admin consent workflow and app governance"
      ],
      [
       "Account takeover",
       "Session token stolen and replayed",
       "Phishing-resistant MFA, token binding, session risk detection"
      ],
      [
       "Insider data theft",
       "Leaver bulk-downloads customer files",
       "Behaviour analytics and download controls"
      ],
      [
       "Shadow SaaS",
       "Teams adopt tools without review",
       "Discovery from SWG logs and a fast approval path"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "In consent phishing the victim approves a malicious application, which receives **OAuth tokens** to read mail or files (ATT&CK T1528, Steal Application Access Token). Resetting the password does not revoke those grants. Response must remove the application's consent and revoke its tokens, and prevention requires admin approval for apps requesting sensitive permissions.",
     "title": "Consent phishing survives a password reset"
    },
    {
     "type": "framework",
     "title": "OWASP API Security Top 10 (2023)",
     "items": [
      {
       "label": "API1",
       "title": "Broken object level authorisation",
       "text": "The API returns or changes an object without checking that the caller may access that specific object."
      },
      {
       "label": "API2",
       "title": "Broken authentication",
       "text": "Weak token validation, credential stuffing or missing protection on authentication endpoints."
      },
      {
       "label": "API3",
       "title": "Broken object property level authorisation",
       "text": "Clients can read or set fields they should not, such as a role or price."
      },
      {
       "label": "API4",
       "title": "Unrestricted resource consumption",
       "text": "No limits on rate, payload size or costly operations."
      },
      {
       "label": "API5",
       "title": "Broken function level authorisation",
       "text": "Ordinary users can call administrative functions."
      },
      {
       "label": "API6",
       "title": "Unrestricted access to sensitive business flows",
       "text": "Automated abuse of flows such as purchasing or account creation."
      },
      {
       "label": "API7",
       "title": "Server-side request forgery",
       "text": "The API fetches a user-supplied URL without validation."
      },
      {
       "label": "API8",
       "title": "Security misconfiguration",
       "text": "Verbose errors, permissive CORS, missing hardening."
      },
      {
       "label": "API9",
       "title": "Improper inventory management",
       "text": "Old, undocumented or test API versions left reachable."
      },
      {
       "label": "API10",
       "title": "Unsafe consumption of APIs",
       "text": "Blindly trusting data returned by third-party APIs."
      }
     ]
    },
    {
     "type": "layers",
     "title": "Layers of API protection",
     "items": [
      {
       "label": "Monitoring",
       "parts": [
        "Per-client baselines",
        "Enumeration and scraping detection",
        "Logs to SIEM"
       ]
      },
      {
       "label": "Application authorisation",
       "parts": [
        "Object-level ownership checks",
        "Field-level filtering",
        "Function-level roles"
       ]
      },
      {
       "label": "API gateway",
       "parts": [
        "Token validation",
        "Scopes",
        "Rate and size limits",
        "Schema validation"
       ]
      },
      {
       "label": "Edge",
       "parts": [
        "WAF and bot protection",
        "DDoS mitigation",
        "TLS"
       ]
      },
      {
       "label": "Inventory",
       "parts": [
        "Discovered endpoints",
        "Versions and owners",
        "Retirement plan"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Gateway policy for a statements API",
     "device": "API gateway · route policy (illustrative YAML)",
     "lines": [
      "route: /v2/accounts/{accountId}/statements",
      "methods: [GET]",
      "auth:",
      "  jwt:",
      "    issuer: https://idp.corp.example",
      "    audiences: [statements-api]",
      "    algorithms: [RS256]",
      "    required_scopes: [statements.read]",
      "rate_limit: {per_client: 100/minute, burst: 20}",
      "request_validation: {schema: openapi/statements-v2.yaml, reject_unknown_fields: true}",
      "logging: {fields: [client_id, sub, route, status, latency_ms], redact: [authorization]}"
     ],
     "note": "The gateway proves **who** is calling and **what scope** they hold. It cannot know whether the token's subject owns `accountId`; that object-level check must happen in the service on every request."
    },
    {
     "type": "scenario",
     "situation": "A bug-bounty researcher reports that changing `accountId` in `/v2/accounts/{accountId}/statements` returns other customers' statements. The token is valid and has the `statements.read` scope. What is the correct fix?",
     "options": [
      {
       "text": "Replace numeric account IDs with random identifiers so that other customers' accounts cannot be guessed.",
       "feedback": "Makes guessing harder but does not fix authorisation; leaked or observed IDs would still work.",
       "best": false
      },
      {
       "text": "Lower the gateway rate limit to ten requests per minute per client so that scraping other customers' statements becomes too slow to matter.",
       "feedback": "Slows abuse but still serves other customers' data on every allowed request.",
       "best": false
      },
      {
       "text": "Enforce an object-level check in the service that the caller owns the requested account, and detect callers enumerating many IDs.",
       "feedback": "Best. This is broken object level authorisation (API1). Only the service knows ownership, and monitoring catches enumeration attempts.",
       "best": true
      },
      {
       "text": "Add a WAF rule that blocks requests where the accountId differs from the one in the previous request.",
       "feedback": "Fragile and easy to evade; the WAF cannot know which accounts a caller legitimately owns.",
       "best": false
      }
     ],
     "title": "Statements belonging to someone else"
    },
    {
     "type": "case",
     "title": "SaaS data leak at a logistics firm",
     "context": "A logistics company learns from a customer that a spreadsheet of 18,000 customer contacts and contract values is reachable through a public link. Investigation shows a sales engineer shared a folder as 'anyone with the link' eight months ago for a trade show. The same folder is also readable by a third-party 'slide designer' app that the engineer authorised with full read access to their files. SaaS audit logs are retained for 180 days.",
     "questions": [
      "What are the immediate containment steps?",
      "How do you determine who accessed the data, and what limits that answer?",
      "Which preventive controls would have stopped or shortened the exposure?",
      "Who needs to be involved beyond the security team?"
     ],
     "answer": "Contain by removing the public link and external sharing on the folder, revoking the third-party app's consent and tokens tenant-wide, and checking whether other files share the same link settings. Use SaaS audit logs and the API-mode CASB to list anonymous and app access to the folder, noting that only the last 180 days are available, so earlier access cannot be ruled out; record that gap honestly. Prevention: restrict anonymous links or give them expiry dates, scan for sensitive data with API-mode DLP, require admin consent for apps requesting broad file access, and run SSPM to flag tenant-wide sharing settings. Involve legal and privacy (possible notification duties), the data owner in sales, communications and the customer relationship team, and record the incident under the response process covered in Module 7."
    },
    {
     "type": "steps",
     "title": "SaaS security baseline",
     "items": [
      {
       "title": "Single sign-on everywhere",
       "text": "Federate every SaaS app and disable local passwords except break-glass accounts."
      },
      {
       "title": "Posture management",
       "text": "Run SSPM against a baseline for sharing, guest access, logging and admin roles."
      },
      {
       "title": "Control sharing",
       "text": "Default to internal sharing; external links expire and are monitored."
      },
      {
       "title": "Govern third-party apps",
       "text": "Require admin approval for sensitive scopes and review grants quarterly."
      },
      {
       "title": "Centralise logs",
       "text": "Send SaaS audit logs to the SIEM and extend retention where the platform allows."
      },
      {
       "title": "Offboard completely",
       "text": "Revoke sessions, tokens and app grants when people leave, not just passwords."
      }
     ]
    },
    {
     "type": "checklist",
     "title": "API security review",
     "items": [
      "Every API endpoint and version is in an owned inventory",
      "Tokens validated for issuer, audience, signature algorithm and expiry",
      "Object-level and function-level authorisation enforced in the service",
      "Rate, payload and pagination limits set per client",
      "Requests validated against a schema; unknown fields rejected",
      "Sensitive headers and fields redacted from logs",
      "Old versions retired on a published schedule"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "SSPM",
       "def": "SaaS security posture management: continuous checking of SaaS tenant settings against a security baseline."
      },
      {
       "term": "BOLA",
       "def": "Broken object level authorisation: an API flaw where the server does not verify that the caller may access the specific object requested."
      },
      {
       "term": "Consent phishing",
       "def": "Tricking a user into granting a malicious application OAuth permissions to their data."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A user who approved a malicious mail-reading app has had their password reset. The app keeps reading mail. Why?",
       "options": [
        "The password reset failed to replicate to the mail service before the app connected again",
        "The app is reading a cached copy of the mailbox stored on the user's laptop",
        "The mail service ignores password resets for accounts that have MFA enabled",
        "The app holds OAuth tokens from the consent grant, which a password reset does not revoke"
       ],
       "answer": 3,
       "explain": "Delegated consent issues tokens to the app. They remain valid until the grant is removed and tokens revoked."
      },
      {
       "q": "Which OWASP API risk describes a normal user calling `/admin/users/delete` successfully?",
       "options": [
        "API5 Broken function level authorisation",
        "API1 Broken object level authorisation",
        "API3 Broken object property level authorisation",
        "API9 Improper inventory management"
       ],
       "answer": 0,
       "explain": "Calling an administrative function without the right role is function-level authorisation. BOLA concerns access to specific objects."
      },
      {
       "q": "Why can an API gateway not fully prevent broken object level authorisation?",
       "options": [
        "Gateways cannot validate JWT signatures or token expiry",
        "Gateways only inspect traffic on non-standard ports",
        "Only the service knows which caller owns which object",
        "Gateways cannot read the URL path of HTTPS requests"
       ],
       "answer": 2,
       "explain": "The gateway can validate identity and scope but not business ownership of records, which lives in the application's data."
      },
      {
       "q": "An old `/v1` API, undocumented and unpatched, is still reachable and is abused. Which risk category applies most directly?",
       "options": [
        "API7 Server-side request forgery",
        "API9 Improper inventory management",
        "API2 Broken authentication",
        "API6 Unrestricted access to sensitive business flows"
       ],
       "answer": 1,
       "explain": "Forgotten versions left exposed are an inventory failure, even if other weaknesses are then exploited through them."
      },
      {
       "q": "Which control best reduces the risk of employees approving risky third-party SaaS apps?",
       "options": [
        "An admin consent workflow for apps that request sensitive permissions",
        "A quarterly reminder email explaining the dangers of third-party apps",
        "Blocking all third-party apps for every user with no exception process",
        "Requiring users to change their passwords after approving any app"
       ],
       "answer": 0,
       "explain": "Admin consent puts a review step exactly where the risk arises. A blanket block drives shadow IT, and awareness alone is weak."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m7",
 "order": 7,
 "code": "Respond",
 "title": "Respond — Visibility, SIEM, SOAR & Incident Response",
 "subtitle": "See everything that matters, correlate it into reliable alerts, automate with guardrails and respond with discipline.",
 "outcomes": [
  "Design a question-driven logging and flow telemetry strategy with integrity and tiered retention.",
  "Build SIEM correlation rules and use cases, and monitor the health of every source.",
  "Automate repeatable response with SOAR guardrails and run ATT&CK-mapped threat hunts.",
  "Lead incidents through the response lifecycle with sound evidence handling.",
  "Measure detection and response with clearly defined metrics and drive improvement."
 ],
 "lessons": [
  {
   "id": "m7-l1",
   "title": "Logging Strategy and Flow Telemetry",
   "subtitle": "Decide what to collect, how long to keep it and how to make it trustworthy, then add flow visibility",
   "minutes": 40,
   "objectives": [
    "Build a logging strategy driven by detection and investigation questions.",
    "Set retention tiers and integrity controls that satisfy operations and regulation.",
    "Configure flow export and explain what NetFlow and IPFIX can and cannot show."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "The **Respond** layer of the stack can only be as good as the evidence it receives. Logging everything is unaffordable and still leaves gaps; logging by default settings leaves out the events you will need most. An expert logging strategy starts from questions: *Who signed in, from where, with which factor? Which process opened this connection? What did this host resolve before it called out?* Then it collects exactly the sources that answer them, keeps them long enough and protects them from tampering."
    },
    {
     "type": "table",
     "title": "High-value log sources",
     "head": [
      "Source",
      "Key events",
      "Answers the question"
     ],
     "rows": [
      [
       "Identity provider",
       "Sign-ins, MFA changes, token grants, admin actions",
       "Who accessed what, from where and how?"
      ],
      [
       "EDR",
       "Process, file, registry, network events",
       "What actually ran on the host?"
      ],
      [
       "DNS resolver",
       "Every query and answer",
       "Where did this host try to go?"
      ],
      [
       "Web gateway and firewall",
       "Allowed and denied sessions, URLs, threat events",
       "What crossed the boundary?"
      ],
      [
       "Cloud control plane",
       "API calls that create, change or delete resources",
       "Who changed the cloud and when?"
      ],
      [
       "SaaS audit logs",
       "Sharing, downloads, admin and app-consent events",
       "What happened to our data in SaaS?"
      ],
      [
       "DHCP and asset inventory",
       "Lease and ownership records",
       "Which device and owner had this IP at that time?"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "For every source, write down the use cases it feeds and the investigation questions it answers. A source with no use case is a cost; a use case with no source is a blind spot. Review both lists after every major incident.",
     "title": "Collect for questions, not for volume"
    },
    {
     "type": "framework",
     "title": "Five principles of trustworthy logs",
     "items": [
      {
       "label": "TIME",
       "title": "Synchronised time",
       "text": "All devices use NTP from redundant internal sources, and logs record time zone or UTC with millisecond precision."
      },
      {
       "label": "ID",
       "title": "Consistent identity",
       "text": "Hostnames, usernames and asset IDs are normalised so events from different sources join correctly."
      },
      {
       "label": "INT",
       "title": "Integrity",
       "text": "Logs leave the device quickly over a reliable transport and land in storage that operators cannot silently alter."
      },
      {
       "label": "COV",
       "title": "Measured coverage",
       "text": "Every expected source is inventoried and monitored for silence."
      },
      {
       "label": "RET",
       "title": "Tiered retention",
       "text": "Retention is set by investigation need and regulation, not by default disk size."
      }
     ]
    },
    {
     "type": "table",
     "title": "Retention tiers",
     "head": [
      "Tier",
      "Typical duration",
      "Purpose"
     ],
     "rows": [
      [
       "Hot (indexed, fast search)",
       "30 to 90 days",
       "Alerting, triage and most investigations"
      ],
      [
       "Warm (searchable, slower)",
       "90 days to 1 year",
       "Hunting and late-discovered incidents"
      ],
      [
       "Cold or archive (immutable)",
       "1 to 7 years, per regulation",
       "Legal, regulatory and long-dwell investigations"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Device logging baseline",
     "device": "Router R1 · IOS-style CLI",
     "lines": [
      "clock timezone UTC 0 0",
      "ntp server 10.50.0.11 prefer",
      "ntp server 10.50.0.12",
      "service timestamps log datetime msec show-timezone",
      "logging source-interface Loopback0",
      "logging host 10.50.0.20 transport tcp port 1514",
      "logging trap informational",
      "archive",
      " log config",
      "  logging enable",
      "  notify syslog"
     ],
     "note": "UTC with milliseconds makes cross-device timelines reliable. A fixed source interface keeps the sender identity stable. The archive log config section records who changed the configuration and sends it to syslog. Use TLS-protected syslog where the platform supports it."
    },
    {
     "type": "text",
     "text": "**Flow telemetry** records who talked to whom, when, on which ports and how much, without payload. NetFlow version 9 and its standards-track successor **IPFIX** export these records from routers, switches, firewalls and cloud networks. Flows keep working when traffic is encrypted, scale to large networks and are ideal for spotting lateral movement, beaconing and unusual data volumes. They cannot tell you what was inside the session."
    },
    {
     "type": "cli",
     "title": "Flexible flow export with IPFIX",
     "device": "Router R1 · IOS-style CLI",
     "lines": [
      "flow record ZZ-REC",
      " match ipv4 source address",
      " match ipv4 destination address",
      " match ipv4 protocol",
      " match transport source-port",
      " match transport destination-port",
      " collect counter bytes long",
      " collect counter packets long",
      " collect timestamp absolute first",
      " collect timestamp absolute last",
      "flow exporter ZZ-EXP",
      " destination 10.50.0.20",
      " transport udp 4739",
      " export-protocol ipfix",
      "flow monitor ZZ-MON",
      " record ZZ-REC",
      " exporter ZZ-EXP",
      " cache timeout active 60",
      "interface GigabitEthernet0/1",
      " ip flow monitor ZZ-MON input"
     ],
     "note": "The `match` fields form the flow key; `collect` fields are accumulated per flow. A 60-second active timeout exports long-lived sessions regularly so beacons and large transfers appear quickly. UDP 4739 is the registered IPFIX port."
    },
    {
     "type": "compare",
     "title": "Logs, flows and packets",
     "columns": [
      {
       "title": "Event logs",
       "items": [
        "Rich application and identity context",
        "Depend on each source being configured",
        "Moderate volume"
       ]
      },
      {
       "title": "Flow records",
       "items": [
        "Every conversation, no payload",
        "Work with encrypted traffic",
        "Low volume, long retention is affordable"
       ]
      },
      {
       "title": "Full packet capture",
       "items": [
        "Complete content for deep forensics",
        "Very high storage cost",
        "Little value for encrypted sessions"
       ]
      }
     ]
    },
    {
     "type": "scenario",
     "situation": "The CFO cuts the SIEM budget by half. Today all sources are kept hot for 90 days. What is the best way to protect detection and investigation capability?",
     "options": [
      {
       "text": "Cut hot retention for every source from 90 days to 45 days so that no data source is dropped from the SIEM entirely.",
       "feedback": "Treats all data as equally valuable and halves the window for late-discovered incidents across the board.",
       "best": false
      },
      {
       "text": "Keep identity, EDR, DNS and cloud audit logs hot; move firewall allow logs and flows to cheaper warm storage.",
       "feedback": "Best. High-value sources stay instantly searchable while bulky but still useful data remains available at lower cost.",
       "best": true
      },
      {
       "text": "Stop collecting DNS logs, because they are the highest-volume source in most environments.",
       "feedback": "DNS is among the most valuable sources for detecting command-and-control, tunnelling and phishing clicks.",
       "best": false
      },
      {
       "text": "Sample one in ten events from every source so total volume falls by ninety per cent.",
       "feedback": "Sampling security events breaks correlation and makes it impossible to prove what a specific user or host did.",
       "best": false
      }
     ],
     "title": "Half the logging budget"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "IPFIX",
       "def": "IP Flow Information Export: the IETF standard protocol for exporting flow records, evolved from NetFlow version 9."
      },
      {
       "term": "Hot retention",
       "def": "The period during which logs are fully indexed and quickly searchable for alerting and investigation."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Investigators cannot line up firewall, EDR and identity events for an incident; the same session appears minutes apart. What is the most likely root cause?",
       "options": [
        "The SIEM is sampling events from each source at different rates during busy periods",
        "Firewall logs are sent over UDP, so they always arrive several minutes late",
        "Devices lack a common time source or record inconsistent time zones",
        "EDR agents batch events daily, so their timestamps reflect upload time only"
       ],
       "answer": 2,
       "explain": "Timeline problems almost always trace back to clock drift or mixed time zones. NTP and UTC timestamps fix this."
      },
      {
       "q": "What can flow records **not** tell an investigator?",
       "options": [
        "How many bytes moved between two hosts in an hour",
        "Which internal hosts contacted a given external address",
        "When a long-lived connection began and when it ended",
        "Which file was transferred inside an encrypted session"
       ],
       "answer": 3,
       "explain": "Flows describe conversations, not content. Byte counts, peers and timing are exactly what they record."
      },
      {
       "q": "Why set a short active timeout, such as 60 seconds, on a flow monitor?",
       "options": [
        "So the router deletes its flow cache before memory runs out on busy links",
        "So long-lived connections are exported regularly instead of only when they end",
        "So the collector can decrypt traffic inside each flow during the timeout window",
        "So each flow record includes the full packet payload for the first minute"
       ],
       "answer": 1,
       "explain": "Without an active timeout a multi-hour session would not appear until it closed, hiding beacons and large transfers."
      },
      {
       "q": "Which tier is most appropriate for logs that regulation requires you to keep for five years but which are rarely searched?",
       "options": [
        "Hot, fully indexed storage",
        "Cold, immutable archive",
        "Local disk on each device",
        "The analysts' own workstations"
       ],
       "answer": 1,
       "explain": "Long, rarely searched retention belongs in low-cost immutable storage. Keeping it hot is expensive; keeping it on devices risks loss and tampering."
      },
      {
       "q": "Why should DHCP lease logs be part of a security logging strategy?",
       "options": [
        "They contain the full DNS history of every device on the network",
        "They show which processes on each host opened network connections",
        "They map an IP address at a given time to a specific device and owner",
        "They record the user's MFA method for every successful sign-in"
       ],
       "answer": 2,
       "explain": "Many alerts carry only an IP address. DHCP records link that address to a device at the time of the event."
      }
     ]
    }
   ]
  },
  {
   "id": "m7-l2",
   "title": "SIEM Correlation and Detection Use Cases",
   "subtitle": "Turn normalised events into reliable alerts with correlation rules, risk scoring and health monitoring",
   "minutes": 40,
   "objectives": [
    "Describe the SIEM pipeline from collection to feedback.",
    "Choose the right correlation rule type for a detection goal.",
    "Write and read portable detection rules and correlation queries.",
    "Onboard log sources with documented owners, parsers and health checks."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "A security information and event management (SIEM) platform collects events, normalises them into a common schema, enriches them with context and runs correlation logic that raises alerts and cases. Its value depends far more on **data quality and use-case engineering** than on the product. The same principles apply whether the SIEM is a cloud data lake, a commercial platform or an open-source stack."
    },
    {
     "type": "flow",
     "title": "The SIEM pipeline",
     "items": [
      {
       "label": "Collect",
       "text": "Agents, syslog, APIs and cloud connectors"
      },
      {
       "label": "Parse and normalise",
       "text": "Fields mapped to a common schema"
      },
      {
       "label": "Enrich",
       "text": "Asset owner, criticality, identity, threat intelligence"
      },
      {
       "label": "Correlate",
       "text": "Rules, sequences, baselines and risk scores"
      },
      {
       "label": "Alert and case",
       "text": "Prioritised work for analysts or automation"
      },
      {
       "label": "Feedback",
       "text": "Dispositions tune rules and reveal gaps"
      }
     ]
    },
    {
     "type": "table",
     "title": "Correlation rule types",
     "head": [
      "Type",
      "Logic",
      "Example"
     ],
     "rows": [
      [
       "Single event",
       "One event matches conditions",
       "Service installed from a user-writable path"
      ],
      [
       "Threshold",
       "Count exceeds a limit within a window",
       "15 or more users fail sign-in from one IP in an hour"
      ],
      [
       "Sequence",
       "Events occur in order within a window",
       "Spray failures, then a success, then an MFA method added"
      ],
      [
       "Absence",
       "Expected events stop arriving",
       "No firewall logs from a site for 30 minutes"
      ],
      [
       "Baseline",
       "Deviation from learned behaviour",
       "User downloads ten times their 30-day average"
      ],
      [
       "Risk-based",
       "Entity risk accumulates across many weak signals",
       "Alert when a user's risk score passes 80 in 24 hours"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "A portable detection rule in Sigma format",
     "device": "Detection repository · sigma rule (YAML)",
     "lines": [
      "title: Service Installed From User-Writable Path",
      "status: experimental",
      "description: Detects a new Windows service whose binary sits in a user-writable folder",
      "logsource:",
      "  product: windows",
      "  service: system",
      "detection:",
      "  selection:",
      "    Provider_Name: 'Service Control Manager'",
      "    EventID: 7045",
      "    ImagePath|contains:",
      "      - '\\AppData\\'",
      "      - '\\Users\\Public\\'",
      "  condition: selection",
      "falsepositives:",
      "  - Poorly packaged software that installs services from user profiles",
      "level: high",
      "tags:",
      "  - attack.persistence",
      "  - attack.t1543.003"
     ],
     "note": "Sigma is an open, vendor-neutral rule format that converts into many SIEM query languages, so detections can live in version control and be reviewed like code."
    },
    {
     "type": "cli",
     "title": "A threshold-and-sequence query: spray then success",
     "device": "SIEM · SQL-style correlation query",
     "lines": [
      "-- Password spraying (T1110.003) followed by a valid login (T1078)",
      "SELECT src_ip,",
      "       COUNT(DISTINCT CASE WHEN result = 'failure' THEN user_name END) AS users_failed,",
      "       COUNT(CASE WHEN result = 'success' THEN 1 END) AS successes",
      "FROM signin_events",
      "WHERE event_time > NOW() - INTERVAL '1 hour'",
      "GROUP BY src_ip",
      "HAVING COUNT(DISTINCT CASE WHEN result = 'failure' THEN user_name END) >= 15",
      "   AND COUNT(CASE WHEN result = 'success' THEN 1 END) >= 1;"
     ],
     "note": "Counting **distinct users** rather than total failures is what separates spraying (few attempts against many accounts) from brute force against one account."
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "Instead of alerting on every weak signal, add points to the user or host involved: an unusual country, a new MFA device, a mass download. Alert when the entity's total passes a threshold. Analysts see one rich alert about a risky entity rather than ten thin ones, and weak signals still contribute.",
     "title": "Risk-based alerting cuts noise"
    },
    {
     "type": "steps",
     "title": "Building a use case end to end",
     "items": [
      {
       "title": "Start from a threat",
       "text": "Pick an ATT&CK technique relevant to your threat model and crown jewels."
      },
      {
       "title": "Check the data",
       "text": "Confirm the required events are collected, parsed and complete."
      },
      {
       "title": "Write the logic",
       "text": "Draft the rule and its expected false positives."
      },
      {
       "title": "Test with emulation",
       "text": "Run a safe, authorised simulation of the technique and confirm the alert fires."
      },
      {
       "title": "Tune and document",
       "text": "Measure precision on real data and record the use-case card."
      },
      {
       "title": "Hand over",
       "text": "Give the SOC a triage guide and link the alert to a response playbook."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "A rule cannot fire on data that never arrives. Parsers break after upgrades, agents stop, firewall syslog is misrouted after a change. Every critical source needs an **absence** rule and an owner, and detection coverage reports should only count use cases whose data actually flowed in the last day.",
     "title": "Silence is the most dangerous signal"
    },
    {
     "type": "template",
     "title": "Log source onboarding sheet",
     "purpose": "Bring every new source into the SIEM with an owner, a parser, a health check and a purpose.",
     "columns": [
      "Source",
      "Owner",
      "Transport and parser",
      "Key normalised fields",
      "Expected volume per day",
      "Retention tier",
      "Health check"
     ],
     "example": [
      [
       "Branch NGFW cluster EU-2",
       "Network security team",
       "Syslog over TLS; NGFW parser v4",
       "src_ip, dst_ip, dst_port, action, rule, app, user",
       "38 GB",
       "Hot 90 days, cold 3 years",
       "Alert if no events for 15 minutes"
      ]
     ],
     "rows": 6
    },
    {
     "type": "scenario",
     "situation": "During an investigation you discover that firewall logs from the Manila office stopped reaching the SIEM three days ago after a firewall upgrade. Nobody noticed. What should you change first?",
     "options": [
      {
       "text": "Add absence rules for every critical source with a named owner, and report detection coverage only for sources that are actually flowing.",
       "feedback": "Best. It turns silent failure into an alert and makes coverage figures honest.",
       "best": true
      },
      {
       "text": "Ask the network team to email the SOC before every upgrade so analysts can watch for problems.",
       "feedback": "Helpful courtesy, but relies on memory and misses failures that are not caused by planned changes.",
       "best": false
      },
      {
       "text": "Buy a second SIEM to receive a copy of every log in case the first one misses events.",
       "feedback": "Doubles cost and complexity without detecting the real failure, which happened before logs reached any SIEM.",
       "best": false
      },
      {
       "text": "Increase hot retention so that missing logs can be recovered from the SIEM after the fact.",
       "feedback": "Logs that never arrived cannot be recovered by keeping other logs longer.",
       "best": false
      }
     ],
     "title": "Three silent days"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Normalisation",
       "def": "Mapping fields from different log formats into one common schema so events can be searched and correlated together."
      },
      {
       "term": "Correlation rule",
       "def": "SIEM logic that combines one or more events, counts, sequences or baselines to decide when to raise an alert."
      },
      {
       "term": "Risk-based alerting",
       "def": "Accumulating risk points on users or hosts from many weak signals and alerting when a threshold is exceeded."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Which correlation logic best separates password spraying from brute force against one account?",
       "options": [
        "Count total failed sign-ins per username over the last 24 hours",
        "Alert on any single failed sign-in from an external IP address",
        "Alert when one account's password is changed twice in a day",
        "Count distinct usernames with failures per source over a time window"
       ],
       "answer": 3,
       "explain": "Spraying tries one or two passwords across many accounts, so distinct-user counts per source reveal it. Per-account counts catch brute force instead."
      },
      {
       "q": "A rule should alert when no events arrive from the core firewalls for 30 minutes. Which rule type is this?",
       "options": [
        "Absence",
        "Sequence",
        "Baseline",
        "Single event"
       ],
       "answer": 0,
       "explain": "Absence rules fire when expected data stops, protecting against silent blind spots."
      },
      {
       "q": "What is the main benefit of writing detections in an open rule format kept in version control?",
       "options": [
        "Rules can be reviewed, tested and converted for different SIEM platforms",
        "Rules no longer need any log sources because the format includes sample data",
        "Rules automatically gain higher precision when converted between platforms",
        "Rules are executed by the endpoint agents rather than by the SIEM itself"
       ],
       "answer": 0,
       "explain": "Detection-as-code brings peer review, history and portability. It does not remove the need for data or guarantee quality."
      },
      {
       "q": "In the SIEM pipeline, which stage adds the asset owner and business criticality to an event?",
       "options": [
        "Collection",
        "Correlation",
        "Enrichment",
        "Feedback"
       ],
       "answer": 2,
       "explain": "Enrichment joins events with context such as asset inventory, identity attributes and threat intelligence before correlation."
      },
      {
       "q": "A use case shows as 'covered' on the dashboard, but its data source has been silent for a week. What does this reveal?",
       "options": [
        "The rule must be rewritten in a different query language to work again",
        "Coverage reporting must confirm that the data is actually flowing",
        "Coverage is accurate because the rule logic itself has not been changed",
        "The SIEM has corrupted the rule and needs to be restored from backup"
       ],
       "answer": 1,
       "explain": "A rule without data detects nothing. Honest coverage metrics combine rule existence with source health."
      }
     ]
    }
   ]
  },
  {
   "id": "m7-l3",
   "title": "SOAR Playbooks and Threat Hunting",
   "subtitle": "Automate the repeatable with guardrails, and hunt for what no rule has caught yet",
   "minutes": 40,
   "objectives": [
    "Decide which response tasks to automate fully, partly or not at all.",
    "Read and design a SOAR playbook with approval gates.",
    "Run hypothesis-driven, ATT&CK-mapped threat hunts and convert findings into detections."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "**Security orchestration, automation and response (SOAR)** connects the SIEM, EDR, email, identity and network controls through APIs so that repeatable steps run in seconds and consistently. **Threat hunting** is the opposite discipline: human-led, hypothesis-driven searching for activity that existing rules missed. Mature SOCs use both, and each feeds the other: hunts produce new detections, and automation frees time to hunt."
    },
    {
     "type": "table",
     "title": "What to automate",
     "head": [
      "Task",
      "Automation level",
      "Human gate"
     ],
     "rows": [
      [
       "Enrichment (whois, reputation, asset owner)",
       "Full",
       "None"
      ],
      [
       "Phishing report triage",
       "High",
       "Analyst reviews borderline scores"
      ],
      [
       "Block indicator at gateway and DNS",
       "High",
       "Protected allow list for own and partner domains"
      ],
      [
       "Isolate an endpoint",
       "Conditional",
       "Automatic only for critical, high-confidence alerts; else approval"
      ],
      [
       "Disable a user account",
       "Conditional",
       "Approval for executives and service accounts"
      ],
      [
       "Purge email from all mailboxes",
       "Partial",
       "Approval before tenant-wide deletion"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "A phishing triage playbook",
     "device": "SOAR · playbook definition (illustrative YAML)",
     "lines": [
      "playbook: phishing-report-triage",
      "trigger: {source: mailbox, address: report-phish@corp.example}",
      "steps:",
      "  - id: extract",
      "    action: email.parse_indicators",
      "  - id: enrich",
      "    action: intel.lookup",
      "    input: \"{{ extract.indicators }}\"",
      "  - id: detonate",
      "    action: sandbox.submit",
      "    when: \"{{ extract.attachments | length > 0 }}\"",
      "  - id: score",
      "    action: verdict.combine",
      "  - id: contain",
      "    when: \"{{ score.value >= 80 }}\"",
      "    approval: {required: true, group: soc-tier2, timeout_minutes: 15}",
      "    actions: [email.purge_similar, swg.block_url, dns.block_domain]",
      "  - id: close_loop",
      "    action: case.update_and_reply_to_reporter"
     ],
     "note": "Enrichment and detonation run automatically; destructive actions wait for a Tier 2 approval with a timeout. Replying to the reporter keeps users motivated to report."
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Protect critical assets with allow lists so automation never blocks your own domains, identity providers or domain controllers. Rate-limit destructive actions, require approvals where impact is high, log every automated action with its inputs, and build a tested rollback. A playbook that can isolate 500 hosts in a minute because of one bad indicator is itself a risk.",
     "title": "Guardrails for automated response"
    },
    {
     "type": "text",
     "text": "**Threat hunting** assumes that some compromise has already evaded detection. A hunt starts with a **hypothesis**: a specific, testable statement about attacker behaviour in your environment, usually tied to an ATT&CK technique. The hunter then checks whether the data exists, searches it, and ends with one of three results: evidence of malicious activity (escalate to incident response), a new or improved detection, or a documented data gap."
    },
    {
     "type": "flow",
     "title": "The hunting loop",
     "items": [
      {
       "label": "Hypothesis",
       "text": "Specific and testable, mapped to ATT&CK"
      },
      {
       "label": "Data",
       "text": "Confirm sources and time range"
      },
      {
       "label": "Investigate",
       "text": "Query, pivot, stack and compare"
      },
      {
       "label": "Findings",
       "text": "Malicious, benign or data gap"
      },
      {
       "label": "Automate",
       "text": "Turn the logic into a detection"
      },
      {
       "label": "Refine",
       "text": "Update threat model and next hypotheses"
      }
     ]
    },
    {
     "type": "table",
     "title": "Example hypotheses",
     "head": [
      "Hypothesis",
      "ATT&CK",
      "Data",
      "What to look for"
     ],
     "rows": [
      [
       "An implant is beaconing to the internet over HTTPS",
       "T1071.001 Web Protocols",
       "Proxy or flow logs",
       "Regular intervals, low jitter, consistent request sizes"
      ],
      [
       "Attackers persist with scheduled tasks on servers",
       "T1053.005 Scheduled Task",
       "EDR, task-creation events",
       "Tasks running binaries from user-writable paths"
      ],
      [
       "Stolen credentials are used from unusual places",
       "T1078 Valid Accounts",
       "Identity provider logs",
       "New country, new device and new MFA method together"
      ],
      [
       "Data is staged for upload to cloud storage",
       "T1567.002 Exfiltration to Cloud Storage",
       "Web gateway and EDR",
       "Large archives created then uploaded to unsanctioned storage"
      ],
      [
       "RDP is used for lateral movement",
       "T1021.001 Remote Desktop Protocol",
       "Windows logon events, flows",
       "Workstation-to-workstation RDP sessions"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Hunting for beaconing in proxy logs",
     "device": "SIEM · SQL-style hunt query",
     "lines": [
      "-- Many connections with almost constant spacing suggest automated beaconing",
      "WITH c AS (",
      "  SELECT src_ip, dest_host,",
      "         EXTRACT(EPOCH FROM event_time - LAG(event_time)",
      "           OVER (PARTITION BY src_ip, dest_host ORDER BY event_time)) AS gap_s",
      "  FROM proxy_events",
      "  WHERE event_time > NOW() - INTERVAL '24 hours')",
      "SELECT src_ip, dest_host, COUNT(*) AS hits,",
      "       ROUND(AVG(gap_s)) AS mean_gap_s, ROUND(STDDEV(gap_s), 1) AS sd_gap_s",
      "FROM c WHERE gap_s IS NOT NULL",
      "GROUP BY src_ip, dest_host",
      "HAVING COUNT(*) > 200 AND STDDEV(gap_s) < 0.1 * AVG(gap_s)",
      "ORDER BY hits DESC;"
     ],
     "note": "Expect benign hits such as update checkers and monitoring agents; stack them by destination and exclude known software before investigating the remainder."
    },
    {
     "type": "scenario",
     "situation": "Your hunt finds one workstation contacting `stats-cdn.example` every 300 seconds, with a standard deviation of two seconds, for six days. The domain was registered ten days ago and no other host uses it. What do you do?",
     "options": [
      {
       "text": "Add the domain to the DNS block list and close the hunt, because the beacon can no longer reach its server.",
       "feedback": "Blocking alone leaves the implant, its persistence and whatever it already did uninvestigated.",
       "best": false
      },
      {
       "text": "Keep the hunt open for another month to collect more data before telling anyone.",
       "feedback": "Hunting is not a reason to delay response once evidence of compromise exists.",
       "best": false
      },
      {
       "text": "Ask the user whether they recognise the website and close the hunt if they say yes.",
       "feedback": "Users cannot vouch for automated traffic from software they may not know is running.",
       "best": false
      },
      {
       "text": "Escalate to incident response with your evidence, scope the estate for the domain and related indicators, and turn the pattern into a detection.",
       "feedback": "Best. A hunt that finds likely malicious activity hands over to IR immediately and also produces lasting detection value.",
       "best": true
      }
     ],
     "title": "A beacon with a ten-day-old domain"
    },
    {
     "type": "keypoints",
     "title": "What a good hunt leaves behind",
     "items": [
      "A written hypothesis, the queries used and the time range searched",
      "Findings classified as malicious, benign or inconclusive",
      "At least one new or improved detection, or a reason why none is possible",
      "Documented data gaps with an owner to close them",
      "Benign patterns recorded so the next hunter does not repeat the work"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "SOAR",
       "def": "Security orchestration, automation and response: tooling that executes response playbooks across security systems through APIs."
      },
      {
       "term": "Playbook",
       "def": "A defined sequence of response steps, with conditions and approvals, for a specific type of alert or incident."
      },
      {
       "term": "Threat hunting",
       "def": "Proactive, hypothesis-driven searching for malicious activity that existing detections have not flagged."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Which response action is most suitable for full automation without any human approval?",
       "options": [
        "Disabling the account of a senior executive flagged for impossible travel",
        "Purging a suspected phishing email from every mailbox in the tenant",
        "Isolating a production database server after a medium-severity alert",
        "Enriching an alert with asset owner, reputation and geolocation data"
       ],
       "answer": 3,
       "explain": "Enrichment is read-only and low-risk. The other actions have significant business impact and warrant approval or high confidence."
      },
      {
       "q": "A SOAR playbook automatically blocked the company's own identity provider domain after a misclassified indicator. Which guardrail was missing?",
       "options": [
        "A longer timeout before the sandbox returns its verdict on the indicator",
        "A requirement that all indicators come from at least one commercial feed",
        "A rule that playbooks may only run during normal business hours",
        "A protected allow list of critical domains automation may never block"
       ],
       "answer": 3,
       "explain": "Allow lists for critical assets stop automation from causing self-inflicted outages, whatever the source of a bad indicator."
      },
      {
       "q": "What distinguishes a good hunting hypothesis?",
       "options": [
        "It is specific, testable with available data and behaviour-based",
        "It is broad enough to cover every technique in the ATT&CK matrix at once",
        "It is based only on indicators of compromise from the latest threat report",
        "It is designed to confirm that the environment is free of compromise"
       ],
       "answer": 0,
       "explain": "Hunts work best with focused, behaviour-based, testable statements. Broad or confirmation-seeking hunts rarely produce useful results."
      },
      {
       "q": "In the beaconing query, why compare the standard deviation of the gap to its mean?",
       "options": [
        "High variation relative to the average indicates a human browsing interactively",
        "Low variation relative to the average interval indicates automated, regular traffic",
        "The ratio estimates how many bytes were transferred in each beacon session",
        "The ratio identifies which beacons use encrypted rather than plain HTTP"
       ],
       "answer": 1,
       "explain": "Automated beacons tend to have consistent spacing. Human browsing is irregular. Neither statistic says anything about bytes or encryption."
      },
      {
       "q": "A hunt finds nothing malicious but reveals that scheduled-task events are not collected from Linux servers. How should the result be recorded?",
       "options": [
        "As a failed hunt that should be deleted from the hunting log",
        "As proof that Linux servers are not affected by that technique",
        "As a data gap with an owner and plan: a valid hunt outcome",
        "As a reason to stop hunting on Linux until a new SIEM is bought"
       ],
       "answer": 2,
       "explain": "Finding a blind spot is a useful result; it must be owned and closed. Absence of data is not evidence of absence of attack."
      }
     ]
    }
   ]
  },
  {
   "id": "m7-l4",
   "title": "Incident Response Lifecycle and Evidence Handling",
   "subtitle": "Run incidents through a disciplined lifecycle and preserve evidence that will stand up to scrutiny",
   "minutes": 45,
   "objectives": [
    "Apply the incident response lifecycle from preparation to lessons learned.",
    "Choose containment actions with an understanding of their side-effects.",
    "Collect and handle evidence using order of volatility, hashing and chain of custody.",
    "Use a reusable IR playbook template and test it in a tabletop exercise."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Incident response is where every earlier layer is tested at once. The widely used lifecycle in **NIST SP 800-61** has four phases: preparation; detection and analysis; containment, eradication and recovery; and post-incident activity. Revision 3, published in 2025, places incident response inside the broader risk-management functions of the NIST Cybersecurity Framework 2.0, but the operational lifecycle remains the backbone of most playbooks."
    },
    {
     "type": "flow",
     "title": "Incident response lifecycle",
     "items": [
      {
       "label": "Prepare",
       "text": "Plans, playbooks, tools, contacts, exercises"
      },
      {
       "label": "Detect and analyse",
       "text": "Validate, scope, classify severity"
      },
      {
       "label": "Contain",
       "text": "Stop spread and further damage"
      },
      {
       "label": "Eradicate",
       "text": "Remove attacker access and artefacts"
      },
      {
       "label": "Recover",
       "text": "Restore and monitor services"
      },
      {
       "label": "Lessons learned",
       "text": "Review, improve, track actions"
      }
     ]
    },
    {
     "type": "table",
     "title": "Phase activities and outputs",
     "head": [
      "Phase",
      "Key activities",
      "Output"
     ],
     "rows": [
      [
       "Prepare",
       "Roles, on-call, out-of-band communications, legal and regulator contacts, tooling access tested",
       "Approved IR plan and playbooks"
      ],
      [
       "Detect and analyse",
       "Validate alert, build timeline, scope affected users and hosts, assign severity",
       "Incident record with scope and severity"
      ],
      [
       "Contain",
       "Isolate hosts, revoke sessions, block indicators, segment networks",
       "Spread stopped; evidence preserved"
      ],
      [
       "Eradicate",
       "Remove persistence, reset credentials, patch the entry point",
       "Attacker access removed and verified"
      ],
      [
       "Recover",
       "Restore from clean sources, heightened monitoring, staged return to service",
       "Services restored under watch"
      ],
      [
       "Lessons learned",
       "Blameless review, root cause, improvement actions with owners",
       "Action log and updated playbooks"
      ]
     ]
    },
    {
     "type": "framework",
     "title": "Severity levels",
     "items": [
      {
       "label": "SEV1",
       "title": "Critical",
       "text": "Business-critical services down, confirmed data theft or active ransomware. Executive and legal engagement now."
      },
      {
       "label": "SEV2",
       "title": "High",
       "text": "Confirmed compromise of important systems or accounts, contained to a limited scope."
      },
      {
       "label": "SEV3",
       "title": "Medium",
       "text": "Confirmed malicious activity on non-critical assets, no evidence of spread."
      },
      {
       "label": "SEV4",
       "title": "Low",
       "text": "Policy violation or blocked attempt needing follow-up but no compromise."
      }
     ]
    },
    {
     "type": "table",
     "title": "Containment options and their side-effects",
     "head": [
      "Action",
      "Effect",
      "Side-effect to weigh"
     ],
     "rows": [
      [
       "Isolate host via EDR",
       "Stops network activity except management",
       "User loses work; attacker may notice"
      ],
      [
       "Disable account and revoke sessions",
       "Stops credential use everywhere",
       "Service accounts may break dependent systems"
      ],
      [
       "Block indicators at edge, DNS and email",
       "Cuts known command-and-control",
       "Attackers often have backup infrastructure"
      ],
      [
       "Isolate a network segment",
       "Stops lateral spread across many hosts",
       "Large business and possibly safety impact"
      ],
      [
       "Take a service offline",
       "Removes the attack surface entirely",
       "Direct outage; needs business owner decision"
      ]
     ]
    },
    {
     "type": "text",
     "text": "**Evidence handling** determines whether findings can be trusted by executives, insurers, regulators or courts. Collect the most volatile data first, following the order of volatility: memory and running state, then network state, then temporary files, then disk, then remote logs and archives. Work on verified copies, record cryptographic hashes at collection, keep a **chain of custody** showing who held each item and when, and note the time zone of every source."
    },
    {
     "type": "steps",
     "title": "Collecting evidence from a compromised laptop",
     "items": [
      {
       "title": "Decide before acting",
       "text": "Agree with the incident lead whether memory is needed, because isolation or shutdown may change it."
      },
      {
       "title": "Capture volatile data",
       "text": "Memory image and running processes, network connections and logged-on users through EDR."
      },
      {
       "title": "Collect triage artefacts",
       "text": "Event logs, autoruns, browser history, prefetch and the suspicious files."
      },
      {
       "title": "Hash and label",
       "text": "SHA-256 every item at collection and give it a unique evidence ID."
      },
      {
       "title": "Record custody",
       "text": "Log who collected what, when, from where, and where it is stored."
      },
      {
       "title": "Store securely",
       "text": "Write-protected evidence store with restricted, logged access."
      }
     ]
    },
    {
     "type": "cli",
     "title": "Hashing evidence and recording custody",
     "device": "IR workstation · Linux shell",
     "lines": [
      "$ sha256sum HR-LT-0193_mem.raw HR-LT-0193_triage.zip | tee IR-2026-031.sha256",
      "9b2f6c41d8e07a5b3c19f0e2d4a68b7c15e3f9a0d2c4b6e8f1a3c5d7e9b0a2c4  HR-LT-0193_mem.raw",
      "4e7a1c9b3d5f0e2a8c6b4d1f3e5a7c9b2d4f6a8c0e1b3d5f7a9c2e4b6d8f0a1c  HR-LT-0193_triage.zip",
      "# Custody log entry IR-2026-031 / E-01",
      "# 2026-03-14T10:02Z | memory image | collected by A. Osei via EDR | stored evidence-vault/IR-2026-031 | seal 55821",
      "$ sha256sum -c IR-2026-031.sha256",
      "HR-LT-0193_mem.raw: OK",
      "HR-LT-0193_triage.zip: OK"
     ],
     "note": "Re-verify hashes whenever evidence is copied or handed over. A matching hash proves the copy is identical to what was collected."
    },
    {
     "type": "case",
     "title": "Ransomware tabletop at a regional hospital",
     "context": "A 600-bed hospital runs a tabletop exercise. Scenario: at 03:20 on a Sunday, EDR auto-isolates two radiology workstations for shadow-copy deletion. At 03:45 the picture archiving system becomes unavailable and file shares on two clinical servers show renamed files. The attacker entered six days earlier through a contractor's VPN account without MFA. Backups exist: nightly snapshots on the same storage array and a weekly immutable offline copy.",
     "questions": [
      "Who must be woken in the first 30 minutes, and who makes the call on isolating clinical systems?",
      "Which containment actions come first, and what patient-safety trade-offs do they carry?",
      "Which backup can be trusted for recovery, and what must happen before restoring?",
      "What should the lessons-learned review examine?"
     ],
     "answer": "Wake the incident lead, SOC on-call, infrastructure lead, the clinical lead or duty manager with authority over patient-care systems, communications, and legal or privacy. Isolation decisions for clinical systems are made jointly by the incident lead and the clinical authority, because downtime procedures must start first. Containment: disable the contractor account and revoke its sessions, block remote access for third parties pending review, isolate affected segments while keeping life-critical devices on their own protected network, and activate paper-based downtime procedures. The same-array snapshots may be encrypted or deleted by the attacker and are suspect; the weekly immutable offline copy is the trusted recovery source, but only after the six-day intrusion is scoped, persistence removed and credentials reset, otherwise restored systems will be re-infected. Restore into an isolated network and scan before reconnecting. Lessons learned should examine MFA gaps for third-party access, why six days of activity went undetected, backup architecture and restore time, the clarity of clinical decision rights, and communication with staff and patients."
    },
    {
     "type": "template",
     "title": "Incident response playbook",
     "purpose": "Define, for one incident type, who does what in each phase, with the decisions that need approval.",
     "columns": [
      "Phase",
      "Action",
      "Owner",
      "Tools and evidence",
      "Decision or approval",
      "Time target"
     ],
     "example": [
      [
       "Contain",
       "Isolate affected hosts and disable compromised accounts",
       "SOC Tier 2",
       "EDR console, identity provider audit log",
       "Clinical systems need the duty clinical lead's approval",
       "30 minutes from SEV1 declaration"
      ],
      [
       "Recover",
       "Restore file servers from immutable backup into an isolated network",
       "Infrastructure lead",
       "Backup console, restore checklist, hash verification",
       "Incident lead confirms eradication complete",
       "Per service recovery-time objective"
      ]
     ],
     "rows": 8
    },
    {
     "type": "scenario",
     "situation": "Twelve hours into a ransomware incident, the CEO asks the team to restore all file servers from last night's backups immediately so staff can work on Monday. Scoping shows the attacker had access for at least five days and the persistence mechanism is not yet found. What should the incident lead advise?",
     "options": [
      {
       "text": "Restore immediately as requested, because business continuity always overrides security concerns during an incident of this kind.",
       "feedback": "Speed without eradication risks losing the restored data again within hours.",
       "best": false
      },
      {
       "text": "Restore only after persistence is removed and credentials reset, from backups verified clean, into an isolated network first.",
       "feedback": "Best. Restoring into an environment the attacker still controls invites immediate re-encryption, and recent backups may contain the attacker's tools.",
       "best": true
      },
      {
       "text": "Refuse any restoration until a full forensic investigation of every system has been completed and reported.",
       "feedback": "Recovery can proceed in a staged, controlled way well before a full report; refusing everything harms the business unnecessarily.",
       "best": false
      },
      {
       "text": "Restore from a backup taken one month ago to be sure no attacker artefacts are included.",
       "feedback": "Loses a month of data without guaranteeing safety; dwell time and backup contents should drive the choice, not a guess.",
       "best": false
      }
     ],
     "title": "Restore now?"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Chain of custody",
       "def": "A documented record of who collected, handled, transferred and stored each item of evidence, and when."
      },
      {
       "term": "Order of volatility",
       "def": "The principle of collecting evidence from the most short-lived sources, such as memory, before more persistent ones such as disk."
      },
      {
       "term": "Containment",
       "def": "Incident response actions that stop an attack spreading or causing further damage while evidence is preserved."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Which evidence should normally be collected first from a running compromised server?",
       "options": [
        "Memory and current network connections",
        "A full forensic image of the system disk",
        "Archived logs from the central log store",
        "Backup tapes from the previous month"
       ],
       "answer": 0,
       "explain": "Memory and live network state disappear on reboot or isolation. Disk images, archives and backups persist and can follow."
      },
      {
       "q": "Why must a SHA-256 hash be recorded at the moment evidence is collected?",
       "options": [
        "It encrypts the evidence so only the incident team can open the files later",
        "It lets anyone later prove that the evidence has not changed since collection",
        "It compresses the evidence so it can be transferred to the vault more quickly",
        "It removes personal data from the evidence before it is shared with insurers"
       ],
       "answer": 1,
       "explain": "A hash is a fingerprint, not encryption or compression. Matching hashes over time demonstrate integrity."
      },
      {
       "q": "During containment, disabling a compromised service account would stop a nightly billing run. What is the best approach?",
       "options": [
        "Disable the account immediately because security always takes precedence over every business process",
        "Leave the account active and unmonitored until billing completes, then disable it in the morning",
        "Delete the account and recreate it with the same password so the billing job keeps working",
        "Agree the trade-off with the business owner and contain with compensating controls"
       ],
       "answer": 3,
       "explain": "Containment decisions weigh impact. Scoping the account's use and adding monitoring can contain risk while the business decides. Reusing the password defeats the purpose."
      },
      {
       "q": "In NIST SP 800-61 terms, which phase includes removing persistence mechanisms and resetting compromised credentials?",
       "options": [
        "Detection and analysis",
        "Preparation",
        "Containment, eradication and recovery",
        "Post-incident activity"
       ],
       "answer": 2,
       "explain": "Removing the attacker's footholds is eradication, part of the combined containment, eradication and recovery phase."
      },
      {
       "q": "Snapshots on the same storage array as the encrypted file shares are offered for recovery. What is the main concern?",
       "options": [
        "Snapshots are always slower to restore than a full offline backup copy",
        "Snapshots cannot hold file permissions, so access rights would be lost",
        "An attacker with array or admin access may have deleted or encrypted them too",
        "Snapshots are only valid for databases and cannot restore file shares"
       ],
       "answer": 2,
       "explain": "Backups that share administrative control and storage with production are often destroyed by ransomware operators. Immutable, separate copies are trusted."
      }
     ]
    }
   ]
  },
  {
   "id": "m7-l5",
   "title": "Metrics and Continuous Improvement",
   "subtitle": "Measure detection and response honestly and turn every incident into a better defence",
   "minutes": 35,
   "objectives": [
    "Calculate MTTD, MTTR, dwell time and detection coverage from incident data.",
    "Present metrics without the distortions of averages and gaming.",
    "Run a blameless lessons-learned review that produces tracked improvements."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Executives fund what they can see. Well-chosen metrics show whether detection and response are improving, where the bottlenecks are and what investment would change them. Badly chosen metrics reward the wrong behaviour, such as closing alerts quickly instead of correctly. Every metric needs a **precise definition**, a data source and an owner."
    },
    {
     "type": "formula",
     "title": "Core detection and response metrics",
     "items": [
      {
       "name": "Mean time to detect (MTTD)",
       "expr": "Σ (detection time − compromise start time) ÷ number of incidents",
       "meaning": "How long attackers operate before you notice. Start times come from the investigation timeline."
      },
      {
       "name": "Mean time to acknowledge (MTTA)",
       "expr": "Σ (first analyst action − alert time) ÷ number of alerts",
       "meaning": "Queue and staffing health in the SOC."
      },
      {
       "name": "Mean time to contain (MTTC)",
       "expr": "Σ (containment time − detection time) ÷ number of incidents",
       "meaning": "How fast you stop the spread once you know."
      },
      {
       "name": "Mean time to respond (MTTR)",
       "expr": "Σ (resolution time − detection time) ÷ number of incidents",
       "meaning": "End-to-end response effort; define 'resolution' explicitly."
      },
      {
       "name": "Dwell time",
       "expr": "Detection time − initial compromise time",
       "meaning": "Per-incident exposure window; report the median and the worst case."
      },
      {
       "name": "Detection coverage",
       "expr": "Techniques with a tested, flowing detection ÷ techniques in the threat model × 100",
       "meaning": "Breadth of detection against the threats that matter to you."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "MTTR is used for mean time to respond, recover, repair and resolve, and organisations start the clock at different points. Publish a metrics dictionary that fixes each start and stop event. Comparisons across teams or years are meaningless if the definition changed.",
     "title": "Which MTTR?"
    },
    {
     "type": "table",
     "title": "Worked example: four incidents (hours from compromise)",
     "head": [
      "Incident",
      "Detected at",
      "Resolved at",
      "Time to detect",
      "Time to respond"
     ],
     "rows": [
      [
       "IR-1",
       "6",
       "30",
       "6",
       "24"
      ],
      [
       "IR-2",
       "2",
       "12",
       "2",
       "10"
      ],
      [
       "IR-3",
       "40",
       "90",
       "40",
       "50"
      ],
      [
       "IR-4",
       "0.5",
       "4.5",
       "0.5",
       "4"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "example",
     "text": "MTTD = (6 + 2 + 40 + 0.5) ÷ 4 = **12.1 hours**. MTTR = (24 + 10 + 50 + 4) ÷ 4 = **22 hours**. Yet the median time to detect is only (2 + 6) ÷ 2 = **4 hours**: one slow incident (IR-3) drags the mean up. Report medians and the 90th percentile alongside means, and look closely at the outliers, because that is where the process failed.",
     "title": "Reading the worked example"
    },
    {
     "type": "table",
     "title": "A balanced metrics set",
     "head": [
      "Metric",
      "Audience",
      "Good direction",
      "Gaming risk"
     ],
     "rows": [
      [
       "MTTD and median dwell time",
       "Board, CISO",
       "Down",
       "Late timelines that understate start time"
      ],
      [
       "MTTC",
       "CISO, SOC lead",
       "Down",
       "Premature containment claims"
      ],
      [
       "Detection coverage of priority techniques",
       "CISO, detection engineering",
       "Up",
       "Counting rules whose data is not flowing"
      ],
      [
       "Alert precision per use case",
       "Detection engineering",
       "Up",
       "Disabling hard but valuable rules"
      ],
      [
       "Post-incident actions closed on time",
       "Risk committee",
       "Up",
       "Closing actions without verifying them"
      ]
     ]
    },
    {
     "type": "steps",
     "title": "A blameless lessons-learned review",
     "items": [
      {
       "title": "Schedule quickly",
       "text": "Hold the review within two weeks while memories and logs are fresh."
      },
      {
       "title": "Build the timeline",
       "text": "Reconstruct events from evidence, not from memory, with times in UTC."
      },
      {
       "title": "Ask how, not who",
       "text": "Explore why decisions made sense at the time and which conditions allowed the failure."
      },
      {
       "title": "Identify improvements",
       "text": "Detection, prevention, process, people and tooling gaps."
      },
      {
       "title": "Assign and track",
       "text": "Each action has an owner, a due date and a verification method."
      },
      {
       "title": "Close the loop",
       "text": "Update playbooks, detections and training; re-test in the next exercise."
      }
     ]
    },
    {
     "type": "scenario",
     "situation": "After a quarter of detection-engineering work, the board report shows MTTR rose from 9 to 14 hours, and a board member asks whether the SOC is getting worse. Coverage of priority techniques rose from 41% to 68%, and median dwell time fell from 9 days to 2 days. How should the CISO respond?",
     "options": [
      {
       "text": "Promise to bring MTTR back under 9 hours next quarter by closing incidents faster.",
       "feedback": "Optimises the number instead of the outcome and encourages premature closure.",
       "best": false
      },
      {
       "text": "Stop reporting MTTR to the board because it no longer reflects the SOC's real performance now that detection has changed so much.",
       "feedback": "Removing an unfavourable metric damages trust; context is better than concealment.",
       "best": false
      },
      {
       "text": "Explain that new detections now catch harder intrusions earlier, and show MTTR with dwell time and coverage, split by severity.",
       "feedback": "Best. More, earlier detection of harder incidents raises response effort per incident while cutting attacker time in the network, the outcome that matters.",
       "best": true
      },
      {
       "text": "Reduce the number of new detections so that fewer complex incidents enter the queue.",
       "feedback": "Deliberately missing intrusions to improve a metric is the worst possible trade.",
       "best": false
      }
     ],
     "title": "MTTR went up"
    },
    {
     "type": "checklist",
     "title": "Metrics hygiene",
     "items": [
      "Every metric has a written definition with start and stop events",
      "Means are reported with medians and 90th percentiles",
      "Coverage counts only detections with flowing data and a recent test",
      "Metrics are segmented by severity and incident type",
      "Trends are shown over at least four quarters",
      "Lessons-learned actions are tracked to verified closure"
     ]
    },
    {
     "type": "reflection",
     "prompt": "Pick one metric your team reports today. What behaviour does it reward, and what would an analyst do differently if they were trying to make it look good rather than be good?"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "MTTD",
       "def": "Mean time to detect: the average time from the start of a compromise to its detection."
      },
      {
       "term": "MTTR",
       "def": "Mean time to respond (or resolve): the average time from detection to resolution, as defined in the organisation's metrics dictionary."
      },
      {
       "term": "Dwell time",
       "def": "The time an attacker is present in an environment before detection, measured per incident."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Three incidents were detected 4, 8 and 30 hours after compromise. What is the MTTD?",
       "options": [
        "8 hours",
        "14 hours",
        "12 hours",
        "30 hours"
       ],
       "answer": 1,
       "explain": "(4 + 8 + 30) ÷ 3 = 42 ÷ 3 = 14 hours. The median would be 8 hours, showing the effect of one slow detection."
      },
      {
       "q": "Why should the median be reported alongside mean time to detect?",
       "options": [
        "The median is always lower, which makes the SOC's performance look better",
        "Regulators only accept medians, so means cannot be shown to auditors",
        "The median includes incidents that were never detected, unlike the mean",
        "A few extreme incidents can distort the mean and hide typical performance"
       ],
       "answer": 3,
       "explain": "Means are sensitive to outliers. The median shows typical performance while outliers are examined separately."
      },
      {
       "q": "A team reports 90% detection coverage, but a third of the counted rules have had no data for a month. What is the problem?",
       "options": [
        "Coverage is overstated because rules without flowing data detect nothing",
        "Coverage is understated because silent rules are still technically enabled",
        "Coverage is correct because rules are counted regardless of data volume",
        "Coverage cannot be calculated when any rule has been silent for a month"
       ],
       "answer": 0,
       "explain": "Honest coverage requires both the rule and its data. Silent sources should reduce the figure."
      },
      {
       "q": "Which practice best defines a blameless post-incident review?",
       "options": [
        "Asking why decisions made sense at the time and which conditions allowed failure",
        "Avoiding any discussion of mistakes so that nobody in the team feels uncomfortable",
        "Keeping the review confidential to senior managers to protect reputations",
        "Identifying the individual responsible and recording it in their file"
       ],
       "answer": 0,
       "explain": "Blameless does not mean ignoring mistakes; it means examining systemic causes so people share information honestly."
      },
      {
       "q": "What is the risk of using 'alerts closed per analyst per hour' as a performance target?",
       "options": [
        "It slows analysts down because they must record their time for every alert",
        "It increases false positives because closed alerts automatically trigger new ones",
        "It rewards fast closure over correct investigation, so real threats get dismissed",
        "It prevents automation because playbooks cannot close alerts on their own"
       ],
       "answer": 2,
       "explain": "Throughput targets encourage superficial triage. Quality measures such as precision and missed-incident reviews must balance them."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.modules.push({
 "id": "m8",
 "order": 8,
 "code": "ZeroTrust",
 "title": "ZeroTrust — Zero Trust Architecture, Automation & Capstone",
 "subtitle": "Wrap every layer in per-session, evidence-based access decisions, automate policy safely and prove expert readiness.",
 "outcomes": [
  "Design a zero trust architecture using the NIST SP 800-207 components, tenets and deployment models.",
  "Combine identity, device and data signals with continuous verification and micro-segmentation.",
  "Assess maturity and build a phased, measurable zero trust roadmap including legacy systems.",
  "Automate policy deployment and audit with APIs, Python, Ansible and policy-as-code, and govern AI assistance.",
  "Solve a multi-layer expert lab and plan a capstone across the full Defence-in-Depth Stack."
 ],
 "lessons": [
  {
   "id": "m8-l1",
   "title": "Zero Trust Architecture and NIST SP 800-207",
   "subtitle": "The tenets, logical components and deployment approaches that turn zero trust from a slogan into a design",
   "minutes": 40,
   "objectives": [
    "State the zero trust tenets and explain why network location no longer implies trust.",
    "Describe the roles of the policy engine, policy administrator and policy enforcement point.",
    "Compare the deployment approaches and models defined in NIST SP 800-207."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "**ZeroTrust** wraps every other layer of the ZCIE Security Defence-in-Depth Stack. It is not a product and not a single control: it is an architecture in which no subject, device or network location is trusted by default, and every access to a resource is decided per session using current evidence. **NIST SP 800-207** gives the most widely used vendor-neutral vocabulary for that architecture."
    },
    {
     "type": "keypoints",
     "title": "The seven tenets, in summary",
     "items": [
      "All data sources and computing services are treated as **resources**.",
      "All communication is secured **regardless of network location**.",
      "Access to each resource is granted **per session**.",
      "Access is decided by **dynamic policy** using identity, application, device state and other attributes.",
      "The enterprise **monitors the integrity and posture** of all owned and associated assets.",
      "Authentication and authorisation are **dynamic and strictly enforced** before access is allowed.",
      "The enterprise **collects as much information as possible** about assets, network and communications and uses it to improve."
     ]
    },
    {
     "type": "layers",
     "title": "Logical components of a zero trust architecture",
     "items": [
      {
       "label": "Control plane",
       "parts": [
        "Policy engine (PE): makes the decision",
        "Policy administrator (PA): executes it",
        "Together: policy decision point"
       ]
      },
      {
       "label": "Data plane",
       "parts": [
        "Subject and device",
        "Policy enforcement point (PEP)",
        "Enterprise resource"
       ]
      },
      {
       "label": "Policy inputs",
       "parts": [
        "Identity management",
        "Device posture and diagnostics",
        "Threat intelligence",
        "Activity logs and SIEM",
        "Data access policies",
        "PKI",
        "Compliance requirements"
       ]
      }
     ]
    },
    {
     "type": "flow",
     "title": "How one access decision is made",
     "items": [
      {
       "label": "Request",
       "text": "Subject on a device asks for a resource"
      },
      {
       "label": "Intercept",
       "text": "The PEP holds the request"
      },
      {
       "label": "Evaluate",
       "text": "The PE applies policy and its trust algorithm to current inputs"
      },
      {
       "label": "Decide",
       "text": "Allow, deny or allow with conditions"
      },
      {
       "label": "Configure",
       "text": "The PA instructs the PEP and issues session credentials"
      },
      {
       "label": "Monitor",
       "text": "Signals keep flowing; the PA can terminate the session"
      }
     ]
    },
    {
     "type": "table",
     "title": "Component responsibilities",
     "head": [
      "Component",
      "Responsibility",
      "Typical implementations"
     ],
     "rows": [
      [
       "Policy engine (PE)",
       "Grants, denies or revokes access using policy and a trust algorithm",
       "Identity provider conditional access, ZTNA policy service"
      ],
      [
       "Policy administrator (PA)",
       "Establishes or shuts down the path, issues session tokens",
       "ZTNA broker, access proxy control plane"
      ],
      [
       "Policy enforcement point (PEP)",
       "Enables, monitors and terminates connections",
       "Agent, gateway, reverse proxy, micro-segmentation enforcer"
      ],
      [
       "Policy information sources",
       "Feed context to the PE",
       "EDR, device management, SIEM, threat intelligence, data catalogue"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "definition",
     "text": "The logic the policy engine uses to reach a decision. NIST describes **criteria-based** algorithms (every condition must be met) and **score-based** ones (a confidence score must exceed a threshold), and **singular** algorithms that judge each request alone versus **contextual** ones that also consider recent history of the subject.",
     "title": "Trust algorithm"
    },
    {
     "type": "framework",
     "title": "Deployment approaches in SP 800-207",
     "items": [
      {
       "label": "EIG",
       "title": "Enhanced identity governance",
       "text": "Identity and its attributes drive access decisions; strong where users reach SaaS and cloud resources directly."
      },
      {
       "label": "MSEG",
       "title": "Micro-segmentation",
       "text": "Resources are placed in small segments protected by gateways or host enforcement, and policy controls the flows between them."
      },
      {
       "label": "SDP",
       "title": "Network infrastructure and software-defined perimeters",
       "text": "An overlay network brokers connections so resources stay hidden until access is approved."
      }
     ]
    },
    {
     "type": "table",
     "title": "Deployment models",
     "head": [
      "Model",
      "How it works",
      "Good fit"
     ],
     "rows": [
      [
       "Device agent and gateway",
       "Agent on the device talks to a gateway in front of each resource",
       "Managed devices, private apps"
      ],
      [
       "Enclave gateway",
       "Gateway protects a group of resources at an enclave boundary",
       "Legacy systems that cannot host agents"
      ],
      [
       "Resource portal",
       "A portal acts as the PEP for users, often without an agent",
       "Unmanaged devices, web applications"
      ],
      [
       "Application sandboxing",
       "Trusted applications run compartmentalised on the device",
       "High-assurance access from shared devices"
      ]
     ]
    },
    {
     "type": "compare",
     "title": "Perimeter model versus zero trust",
     "columns": [
      {
       "title": "Perimeter model",
       "items": [
        "Inside the network means trusted",
        "Access decided once at the edge or VPN",
        "Flat internal networks",
        "Visibility focused on north-south traffic"
       ]
      },
      {
       "title": "Zero trust",
       "items": [
        "Location confers no trust",
        "Access decided per session and re-evaluated",
        "Resources individually protected",
        "Visibility of identity, device and east-west flows"
       ]
      }
     ]
    },
    {
     "type": "scenario",
     "situation": "A vendor tells your CIO that buying its gateway will make the company 'zero trust compliant'. The CIO asks for your view. What is the best response?",
     "options": [
      {
       "text": "Map the product to the PE, PA and PEP roles and the seven tenets, find the pillars it leaves uncovered, and judge it as one component.",
       "feedback": "Best. Zero trust is an architecture; products fill roles within it. Mapping exposes gaps and integration needs.",
       "best": true
      },
      {
       "text": "Agree, because a gateway that authenticates every user before granting access satisfies the main requirement of a zero trust design.",
       "feedback": "Authentication at one gateway ignores device posture, continuous evaluation, data controls and east-west traffic.",
       "best": false
      },
      {
       "text": "Reject the product outright, because zero trust can only be built from open-source components.",
       "feedback": "Nothing in the architecture requires open source; dismissing products without analysis is equally unhelpful.",
       "best": false
      },
      {
       "text": "Ask the vendor for a compliance certificate and approve the purchase once one is provided.",
       "feedback": "There is no certificate that makes an organisation zero trust; the outcome depends on your design and operations.",
       "best": false
      }
     ],
     "title": "The 'zero trust product'"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Policy engine (PE)",
       "def": "The NIST SP 800-207 component that decides whether to grant, deny or revoke access to a resource."
      },
      {
       "term": "Policy administrator (PA)",
       "def": "The component that executes the policy engine's decision by establishing or shutting down the session path."
      },
      {
       "term": "Policy enforcement point (PEP)",
       "def": "The component in the data path that enables, monitors and terminates connections between a subject and a resource."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Which component in NIST SP 800-207 actually terminates an active session when the policy engine revokes access?",
       "options": [
        "The policy engine, which closes the connection directly at the resource",
        "The policy enforcement point, instructed by the policy administrator",
        "The SIEM, which sends a reset packet to the subject's device",
        "The identity provider, which deletes the user's account immediately"
       ],
       "answer": 1,
       "explain": "The PE decides, the PA communicates the decision and the PEP enforces it in the data path."
      },
      {
       "q": "A policy engine allows access only when every condition (managed device, compliant patch level, MFA, approved country) is met. What kind of trust algorithm is this?",
       "options": [
        "Score-based",
        "Contextual only",
        "Network-based",
        "Criteria-based"
       ],
       "answer": 3,
       "explain": "All conditions must be satisfied, which is the criteria-based approach. A score-based algorithm combines factors into a confidence value."
      },
      {
       "q": "Which deployment approach best fits an organisation whose users mainly reach SaaS applications directly from the internet?",
       "options": [
        "Enhanced identity governance",
        "Micro-segmentation with gateways",
        "Enclave gateways per data centre",
        "Software-defined perimeter overlays"
       ],
       "answer": 0,
       "explain": "When resources are SaaS, identity and its attributes are the main point of control."
      },
      {
       "q": "A plant has legacy controllers that cannot run agents or modern authentication. Which deployment model fits best?",
       "options": [
        "A device agent installed on every controller",
        "An enclave gateway in front of the controllers",
        "Application sandboxing on each controller",
        "A resource portal on each controller's interface"
       ],
       "answer": 1,
       "explain": "Enclave gateways place enforcement in front of a group of resources that cannot protect themselves."
      },
      {
       "q": "Which statement reflects the tenet that communication is secured regardless of network location?",
       "options": [
        "Traffic inside the data centre can stay unencrypted because the perimeter firewall protects it",
        "Only traffic leaving the country needs encryption under a zero trust architecture",
        "Network location replaces identity as the main factor in every access decision",
        "Traffic inside the data centre is authenticated and encrypted like traffic on the internet"
       ],
       "answer": 3,
       "explain": "Zero trust removes implicit trust from location; internal links are treated as hostile networks."
      }
     ]
    }
   ]
  },
  {
   "id": "m8-l2",
   "title": "Identity, Device and Data Controls with Micro-segmentation",
   "subtitle": "Feed access decisions with strong signals, verify continuously and shrink every blast radius",
   "minutes": 40,
   "objectives": [
    "Combine identity, device and data signals in access policy.",
    "Design continuous verification that reacts to changing risk during a session.",
    "Plan and implement micro-segmentation using network, host and workload-native methods."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Zero trust decisions are only as good as the signals behind them. The Identity module built strong authentication; here the question is how identity, device and data signals combine **at decision time** and how they keep flowing **after** access is granted. Then we apply the same thinking to east-west traffic with micro-segmentation, so a compromised workload can reach only what it truly needs."
    },
    {
     "type": "table",
     "title": "Controls and signals by pillar",
     "head": [
      "Pillar",
      "Key controls",
      "Signals for the policy engine"
     ],
     "rows": [
      [
       "Identity",
       "Phishing-resistant MFA, least privilege, just-in-time admin",
       "Sign-in risk, authentication strength, group and role"
      ],
      [
       "Device",
       "Management, encryption, EDR, patch compliance",
       "Compliance state, EDR risk score, certificate"
      ],
      [
       "Network",
       "Micro-segmentation, encrypted transport, ZTNA",
       "Source context, segment, flow anomalies"
      ],
      [
       "Application and workload",
       "Per-app access, workload identity, secure pipelines",
       "Workload identity, vulnerability status"
      ],
      [
       "Data",
       "Classification, labelling, encryption, DLP",
       "Sensitivity label, location, volume of access"
      ]
     ]
    },
    {
     "type": "table",
     "title": "Continuous verification in practice",
     "head": [
      "Signal change during a session",
      "Example",
      "Policy response"
     ],
     "rows": [
      [
       "Device falls out of compliance",
       "EDR stops reporting on the laptop",
       "Block sensitive apps until healthy"
      ],
      [
       "Identity risk rises",
       "Leaked-credential alert for the user",
       "Revoke sessions and require re-authentication"
      ],
      [
       "Location anomaly",
       "Same session token used from two countries",
       "Terminate session and investigate token theft"
      ],
      [
       "Unusual data behaviour",
       "Bulk download of restricted files",
       "Step-up authentication or block download"
      ],
      [
       "Account change",
       "User removed from the group by HR process",
       "Access ends on the next evaluation, not next login"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Long-lived tokens undermine continuous verification: if a session token lasts eight hours, a risk change at minute five is ignored for the rest of the day. Use short token lifetimes plus event-driven revocation, for example through the OpenID Shared Signals Framework and its Continuous Access Evaluation Profile, so identity providers and applications share risk events in near real time.",
     "title": "Revocation must be fast"
    },
    {
     "type": "text",
     "text": "**Data-centric controls** make sensitivity a first-class policy input. Classify and label data, encrypt it at rest and in transit, and let access policy depend on the label: a managed, compliant laptop may download *Confidential* files; an unmanaged browser session may only view them. Data loss prevention then enforces the same labels at the endpoint, gateway and SaaS layers."
    },
    {
     "type": "compare",
     "title": "Ways to micro-segment",
     "columns": [
      {
       "title": "Network-based",
       "items": [
        "VLANs, VRFs, ACLs and internal firewalls",
        "No host changes needed",
        "Coarse; rule sprawl on IP addresses",
        "Good for OT and legacy"
       ]
      },
      {
       "title": "Host-based",
       "items": [
        "Agents program each host's firewall",
        "Policy follows labels, not IPs",
        "Fine-grained, works across clouds",
        "Needs agent coverage"
       ]
      },
      {
       "title": "Workload-native",
       "items": [
        "Cloud security groups, container network policies",
        "Service mesh with mutual TLS workload identity",
        "Built into the platform",
        "Different model per platform"
       ]
      }
     ]
    },
    {
     "type": "steps",
     "title": "Rolling out micro-segmentation",
     "items": [
      {
       "title": "Discover",
       "text": "Run in visibility mode to map real flows between applications for several weeks."
      },
      {
       "title": "Label",
       "text": "Tag workloads by environment, application, tier and data sensitivity."
      },
      {
       "title": "Ring-fence crown jewels",
       "text": "Write allow policies around the most critical applications first."
      },
      {
       "title": "Simulate",
       "text": "Run policies in test mode and review what would have been blocked."
      },
      {
       "title": "Enforce in waves",
       "text": "Turn on enforcement application by application with rollback ready."
      },
      {
       "title": "Operate",
       "text": "Route new flows through change control and alert on policy violations."
      }
     ]
    },
    {
     "type": "cli",
     "title": "Workload-native segmentation for a payments database",
     "device": "Kubernetes · NetworkPolicy (YAML)",
     "lines": [
      "apiVersion: networking.k8s.io/v1",
      "kind: NetworkPolicy",
      "metadata:",
      "  name: payments-db-ingress",
      "  namespace: payments",
      "spec:",
      "  podSelector:",
      "    matchLabels:",
      "      app: payments-db",
      "  policyTypes:",
      "  - Ingress",
      "  ingress:",
      "  - from:",
      "    - podSelector:",
      "        matchLabels:",
      "          app: payments-api",
      "    ports:",
      "    - protocol: TCP",
      "      port: 5432"
     ],
     "note": "Only pods labelled `payments-api` in the same namespace may reach the database on TCP 5432. Network policies are enforced only when the cluster's network plugin supports them; pair this with a namespace-wide default-deny policy."
    },
    {
     "type": "callout",
     "kind": "pro",
     "text": "A quick, high-value first step in a flat network is to block workstation-to-workstation SMB, RDP and remote management, and to restrict administrative protocols to hardened jump hosts. It cuts the main lateral-movement paths used in ransomware attacks without waiting for full application mapping.",
     "title": "Start with the protocols attackers love"
    },
    {
     "type": "scenario",
     "situation": "A manufacturer's data centre has 3,000 servers on a few large VLANs. After a competitor suffered ransomware, the board wants micro-segmentation within a year. Application documentation is poor. Where should you start?",
     "options": [
      {
       "text": "Write a complete rule set for all 3,000 servers from the existing application documentation and enforce it over one long weekend.",
       "feedback": "Poor documentation guarantees broken applications and a rollback, damaging trust in the programme.",
       "best": false
      },
      {
       "text": "Re-address every server into hundreds of small VLANs before deciding on any access policy.",
       "feedback": "Massive disruption with no policy to enforce; segmentation should follow understanding of flows.",
       "best": false
      },
      {
       "text": "Wait until a full application inventory is complete, then begin designing segments.",
       "feedback": "Inventories of that size take years; visibility tools can build the map while early controls reduce risk.",
       "best": false
      },
      {
       "text": "Map flows first, restrict admin and workstation-to-workstation protocols now, then ring-fence the crown jewels.",
       "feedback": "Best. It delivers early risk reduction, builds the dependency map that later policy needs and focuses enforcement where impact is highest.",
       "best": true
      }
     ],
     "title": "Three thousand servers, one flat network"
    },
    {
     "type": "reflection",
     "prompt": "Which three flows in your environment would an attacker most want to use after compromising one workstation? How would identity, device and segmentation controls each make those flows harder?"
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Micro-segmentation",
       "def": "Dividing an environment into small zones, down to individual workloads, with policy controlling each allowed flow between them."
      },
      {
       "term": "Continuous verification",
       "def": "Re-evaluating access during a session as identity, device, behaviour and threat signals change."
      },
      {
       "term": "Device posture",
       "def": "The security state of a device, such as management, encryption, EDR health and patch level, used as an access input."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "A user's laptop stops reporting EDR telemetry mid-session. Under continuous verification, what should happen?",
       "options": [
        "Nothing changes until the user's session expires at the end of the working day",
        "The user's account is deleted because an agent failure indicates malicious intent",
        "Access to sensitive applications is restricted until the device is healthy again",
        "The laptop is automatically reimaged remotely before the user can save their work"
       ],
       "answer": 2,
       "explain": "Policy reacts proportionately to the changed signal. Waiting for expiry ignores it; deleting accounts or reimaging is disproportionate."
      },
      {
       "q": "Why do long-lived session tokens weaken a zero trust design?",
       "options": [
        "They require stronger encryption, which slows down every application request",
        "They prevent users from accessing more than one application at a time",
        "They force the policy engine to evaluate every packet instead of each session",
        "Risk changes after issue are ignored until the token expires or is revoked"
       ],
       "answer": 3,
       "explain": "Continuous verification needs tokens that are short-lived or revocable on risk events."
      },
      {
       "q": "Which micro-segmentation method writes policy based on workload labels and follows workloads across clouds?",
       "options": [
        "VLANs and access control lists",
        "A perimeter firewall cluster",
        "Host-based agent enforcement",
        "Static routes between subnets"
       ],
       "answer": 2,
       "explain": "Host-based agents program each host's firewall from labels, independent of IP addressing and location."
      },
      {
       "q": "In the network policy example, which traffic is allowed to the payments database?",
       "options": [
        "TCP 5432 from pods labelled payments-api in the payments namespace",
        "Any TCP traffic from any pod in any namespace of the cluster",
        "TCP 5432 from every pod in the payments namespace regardless of label",
        "All traffic from payments-api pods on every port and protocol"
       ],
       "answer": 0,
       "explain": "The pod selector restricts sources to payments-api pods in the policy's namespace, and the port rule restricts to TCP 5432."
      },
      {
       "q": "What is the purpose of running segmentation policies in simulation mode before enforcement?",
       "options": [
        "To let attackers trigger the policy so their techniques can be studied",
        "To see which legitimate flows would be blocked before enforcement",
        "To measure how much bandwidth the new policies will consume on each link",
        "To satisfy auditors who require every policy to be disabled at first"
       ],
       "answer": 1,
       "explain": "Simulation reveals undocumented dependencies so they can be allowed or challenged before enforcement."
      }
     ]
    }
   ]
  },
  {
   "id": "m8-l3",
   "title": "Zero Trust Maturity and Roadmap",
   "subtitle": "Assess where you are, choose where to go next and deliver zero trust in measurable stages",
   "minutes": 40,
   "objectives": [
    "Assess maturity across pillars and cross-cutting capabilities.",
    "Build a phased zero trust roadmap with measurable outcomes.",
    "Handle legacy and operational technology that cannot meet modern controls."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "No organisation becomes zero trust in a single project. It moves pillar by pillar from implicit trust towards dynamic, automated decisions. A maturity model gives a shared language for where you are and what 'next' looks like; the **CISA Zero Trust Maturity Model** (version 2) is widely used for this and complements the architecture in NIST SP 800-207."
    },
    {
     "type": "table",
     "title": "Maturity stages",
     "head": [
      "Stage",
      "What it looks like"
     ],
     "rows": [
      [
       "Traditional",
       "Manual configuration, static policies, trust based on network location, siloed tools"
      ],
      [
       "Initial",
       "Some automation, first cross-pillar policies, MFA and inventories under way"
      ],
      [
       "Advanced",
       "Centralised visibility, identity and device signals in most decisions, automated responses for common cases"
      ],
      [
       "Optimal",
       "Fully automated, dynamic, just-in-time access with continuous monitoring across all pillars"
      ]
     ]
    },
    {
     "type": "framework",
     "title": "Pillars and cross-cutting capabilities",
     "items": [
      {
       "label": "ID",
       "title": "Identity",
       "text": "Phishing-resistant authentication, lifecycle governance and least privilege."
      },
      {
       "label": "DEV",
       "title": "Devices",
       "text": "Inventory, compliance and risk of every device used for access."
      },
      {
       "label": "NET",
       "title": "Networks",
       "text": "Segmentation, encrypted traffic and resilience."
      },
      {
       "label": "APP",
       "title": "Applications and workloads",
       "text": "Per-application access, secure development and workload identity."
      },
      {
       "label": "DATA",
       "title": "Data",
       "text": "Inventory, classification, encryption and access monitoring."
      },
      {
       "label": "VIS",
       "title": "Visibility and analytics",
       "text": "Telemetry from all pillars feeding detection and decisions."
      },
      {
       "label": "AUTO",
       "title": "Automation and orchestration",
       "text": "Policy and response executed by machines, consistently."
      },
      {
       "label": "GOV",
       "title": "Governance",
       "text": "Policies, ownership and measurement that keep the programme on course."
      }
     ]
    },
    {
     "type": "steps",
     "title": "A three-horizon roadmap",
     "items": [
      {
       "title": "Foundations (0 to 6 months)",
       "text": "Consolidate identity, phishing-resistant MFA for admins and remote access, complete asset inventory, central logging of identity and EDR."
      },
      {
       "title": "Expansion (6 to 18 months)",
       "text": "Device posture in access decisions, ZTNA replacing VPN for priority apps, ring-fence crown-jewel applications, data classification for key repositories."
      },
      {
       "title": "Optimisation (18 to 36 months)",
       "text": "Continuous evaluation with automated revocation, label-driven data policy, automated response, micro-segmentation at scale."
      },
      {
       "title": "Every horizon",
       "text": "Measure outcomes per pillar, review risk, and adjust the plan with the executive sponsor."
      }
     ]
    },
    {
     "type": "table",
     "title": "Legacy and operational technology",
     "head": [
      "Constraint",
      "Compensating approach"
     ],
     "rows": [
      [
       "Cannot run agents",
       "Enclave gateway or network-based segmentation in front of the system"
      ],
      [
       "No modern authentication",
       "Privileged access gateway with MFA and session recording in front of it"
      ],
      [
       "Cannot be patched",
       "Strict allow-list flows, protocol-aware inspection, heightened monitoring"
      ],
      [
       "Safety-critical availability",
       "Monitor-only controls and change windows agreed with operations"
      ]
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Buying products before defining the architecture; trying to change every pillar at once; ignoring legacy and OT until the end; no executive sponsor to settle conflicts between teams; and forgetting **break-glass** access, so an identity-provider outage locks everyone out of the tools needed to fix it.",
     "title": "How zero trust programmes fail"
    },
    {
     "type": "template",
     "title": "Zero trust maturity tracker",
     "purpose": "Track current and target maturity per pillar, with the initiatives, dependencies and evidence that prove progress.",
     "columns": [
      "Pillar",
      "Current stage",
      "Target stage and date",
      "Key initiatives",
      "Dependencies",
      "Owner",
      "Evidence of progress"
     ],
     "example": [
      [
       "Devices",
       "Initial",
       "Advanced by Q4 2027",
       "Posture signals in access policy; block unmanaged devices from admin portals",
       "EDR coverage above 98%; device management for Linux",
       "Endpoint engineering lead",
       "Percentage of sign-ins evaluated with device posture"
      ]
     ],
     "rows": 8
    },
    {
     "type": "case",
     "title": "Zero trust rollout at a national telecom",
     "context": "A telecom with 22,000 staff, 9,000 contractors, two core network data centres and a large OSS/BSS estate wants to adopt zero trust after a contractor account was used to reach billing systems over the remote-access VPN. Network operations relies on legacy element managers that support only local passwords. The identity team runs two directories after a merger. The board wants visible progress within nine months.",
     "questions": [
      "Which outcomes should the first nine months target, and why?",
      "How should contractor access change?",
      "How do you protect legacy element managers that cannot use modern authentication?",
      "How will you show the board that risk is falling?"
     ],
     "answer": "The first horizon should target the attack path that was actually used: consolidate or federate the two directories into one identity plane, enforce phishing-resistant MFA for all remote and privileged access, and move contractors from the VPN to per-application ZTNA with device or browser-isolation conditions and time-bound access tied to contracts. Ring-fence billing and other crown-jewel systems so they are reachable only through brokered access. Legacy element managers sit behind a privileged access gateway that enforces MFA, records sessions and vaults the local passwords, inside an enclave whose flows are allow-listed. Report outcome metrics to the board: percentage of remote and privileged sessions using phishing-resistant MFA, number of contractors still on VPN, crown-jewel applications ring-fenced, and median time to revoke leaver access, alongside maturity stage per pillar."
    },
    {
     "type": "scenario",
     "situation": "The board asks the CISO to 'complete zero trust' within twelve months and to report a single completion percentage. What is the best response?",
     "options": [
      {
       "text": "Accept the deadline and report the percentage of planned zero trust products purchased and deployed as the completion figure each quarter.",
       "feedback": "Measures spending rather than risk reduction and promises something that cannot be delivered.",
       "best": false
      },
      {
       "text": "Decline to give any timeline because zero trust can never be finished.",
       "feedback": "True in principle but unhelpful; the board needs commitments it can track.",
       "best": false
      },
      {
       "text": "Propose a phased roadmap with outcome metrics per pillar and commit to specific maturity targets for twelve months, not completion.",
       "feedback": "Best. Zero trust is a continuing journey; specific, measured targets set honest expectations and still show progress.",
       "best": true
      },
      {
       "text": "Report completion as the percentage of staff who have finished zero trust awareness training.",
       "feedback": "Training matters, but it says little about whether access decisions have actually changed.",
       "best": false
      }
     ],
     "title": "Zero trust 'done' in twelve months"
    },
    {
     "type": "checklist",
     "title": "Roadmap readiness",
     "items": [
      "Executive sponsor named with authority across network, identity and application teams",
      "Crown-jewel applications and data identified and owned",
      "Current maturity assessed for every pillar with evidence",
      "Break-glass accounts defined, protected and tested",
      "Legacy and OT systems listed with compensating approaches",
      "Outcome metrics agreed for each horizon"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Maturity model",
       "def": "A staged description of capability levels used to assess the current state and plan the next steps of a programme."
      },
      {
       "term": "Crown jewels",
       "def": "The applications and data whose compromise would cause the greatest harm, prioritised for the strongest controls."
      },
      {
       "term": "Break-glass account",
       "def": "A tightly protected emergency account that allows administrators to regain access when normal authentication fails."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "At which maturity stage do identity and device signals feed most access decisions, with automated responses for common cases?",
       "options": [
        "Initial",
        "Traditional",
        "Advanced",
        "Optimal"
       ],
       "answer": 2,
       "explain": "Advanced shows centralised visibility and broad use of signals with some automation. Optimal is fully dynamic and automated across all pillars."
      },
      {
       "q": "Legacy network element managers support only local passwords. What is the best compensating control?",
       "options": [
        "Long, complex local passwords shared through the team's encrypted chat channel",
        "Moving the element managers onto the corporate Wi-Fi so they are easier to reach",
        "Disabling logging on the element managers to reduce their attack surface",
        "A privileged access gateway with MFA, password vaulting and session recording"
       ],
       "answer": 3,
       "explain": "The gateway adds strong authentication, accountability and credential protection in front of systems that cannot provide them."
      },
      {
       "q": "Why must break-glass access be designed into a zero trust programme?",
       "options": [
        "Auditors require at least one account that bypasses all logging for emergencies",
        "An outage of the identity provider or policy engine could otherwise lock administrators out",
        "Break-glass accounts replace MFA for administrators during normal operations",
        "Zero trust products will not install without a pre-created emergency account"
       ],
       "answer": 1,
       "explain": "Centralising decisions creates a dependency; protected, monitored emergency access is needed to recover from its failure."
      },
      {
       "q": "What is the most convincing evidence of progress to give a board?",
       "options": [
        "Outcome metrics, such as privileged sessions using phishing-resistant MFA",
        "The number of zero trust products deployed across the organisation this year",
        "The number of policy documents that mention zero trust in their titles",
        "The total budget spent on zero trust initiatives compared with last year"
       ],
       "answer": 0,
       "explain": "Outcome metrics show changed risk. Product counts, documents and spend show activity, not effect."
      },
      {
       "q": "Which first-horizon initiative best addresses an incident in which a contractor's VPN account reached billing systems?",
       "options": [
        "Move contractors to per-app ZTNA with strong MFA and time-bound access",
        "Increase the VPN concentrator's capacity so contractor sessions can be inspected",
        "Require contractors to change their VPN passwords every thirty days from now on",
        "Block contractors from using the VPN outside normal business hours only"
       ],
       "answer": 0,
       "explain": "Per-application access removes the network reach that was abused; the other options leave it in place."
      }
     ]
    }
   ]
  },
  {
   "id": "m8-l4",
   "title": "Security Automation, Policy-as-Code and AI-Assisted Operations",
   "subtitle": "Deploy and audit security policy through code and pipelines, and use AI assistance with firm guardrails",
   "minutes": 45,
   "objectives": [
    "Use APIs, Python and Ansible to audit and deploy security policy consistently.",
    "Express security rules as policy-as-code and enforce them in a pipeline.",
    "Define guardrails for AI-assisted security operations."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "Zero trust at scale is impossible by hand. Thousands of rules, devices and identities change every week, and the **AUTO** capability of the maturity model depends on treating policy as code: stored in version control, tested, reviewed and deployed by pipelines, with continuous checks for drift. This lesson shows the building blocks and the guardrails that keep automation from becoming a new risk."
    },
    {
     "type": "layers",
     "title": "Security automation stack",
     "items": [
      {
       "label": "Governance",
       "parts": [
        "Change approval",
        "Audit trail",
        "Separation of duties"
       ]
      },
      {
       "label": "Pipeline",
       "parts": [
        "Version control",
        "Linting and tests",
        "Staged deployment"
       ]
      },
      {
       "label": "Policy-as-code",
       "parts": [
        "Rule checks",
        "Compliance tests",
        "Drift detection"
       ]
      },
      {
       "label": "Orchestration",
       "parts": [
        "Ansible playbooks",
        "Python scripts",
        "SOAR workflows"
       ]
      },
      {
       "label": "Interfaces",
       "parts": [
        "REST APIs",
        "NETCONF and RESTCONF",
        "Cloud provider APIs"
       ]
      },
      {
       "label": "Targets",
       "parts": [
        "Firewalls",
        "Network devices",
        "Cloud and SaaS controls"
       ]
      }
     ]
    },
    {
     "type": "cli",
     "title": "Auditing firewall rules through an API",
     "device": "Automation host · Python 3",
     "lines": [
      "import os, requests",
      "API = \"https://fw-manager.corp.example/api/v1\"",
      "HDR = {\"Authorization\": f\"Bearer {os.environ['FW_API_TOKEN']}\"}",
      "resp = requests.get(f\"{API}/policies/edge/rules\", headers=HDR, timeout=15)",
      "resp.raise_for_status()",
      "rules = resp.json()[\"rules\"]",
      "risky = [r for r in rules if r[\"action\"] == \"allow\"",
      "         and r[\"source\"] == r[\"destination\"] == r[\"service\"] == \"any\"]",
      "unused = [r for r in rules if r.get(\"hit_count\", 0) == 0]",
      "for r in risky:",
      "    print(f\"ANY-ANY {r['id']:>6} {r['name']}\")",
      "print(f\"{len(risky)} any-any rules, {len(unused)} rules with zero hits\")"
     ],
     "note": "The token comes from the environment, never from the script. TLS verification stays on (the default). Read-only audits like this are the safest first automation and build trust for later write operations."
    },
    {
     "type": "cli",
     "title": "Deploying a management-plane ACL with Ansible",
     "device": "Automation host · Ansible playbook (YAML)",
     "lines": [
      "- name: Enforce management-plane ACL on edge routers",
      "  hosts: edge_routers",
      "  gather_facts: false",
      "  connection: ansible.netcommon.network_cli",
      "  tasks:",
      "    - name: Push ACL rendered from a version-controlled template",
      "      ansible.netcommon.cli_config:",
      "        config: \"{{ lookup('ansible.builtin.template', 'templates/mgmt_acl.j2') }}\"",
      "      register: push",
      "    - name: Record the result for the change ticket",
      "      ansible.builtin.debug:",
      "        msg: \"{{ inventory_hostname }} changed={{ push.changed }}\""
     ],
     "note": "The inventory sets each device's network OS. Run the playbook against a lab group first, then a canary group of routers, before the full estate. The same template feeds both deployment and the audit that checks for drift."
    },
    {
     "type": "cli",
     "title": "Policy-as-code: rules every firewall change must pass",
     "device": "Pipeline · Open Policy Agent (Rego)",
     "lines": [
      "package firewall.review",
      "deny contains msg if {",
      "    some r in input.rules",
      "    r.action == \"allow\"",
      "    r.source == \"any\"",
      "    r.destination == \"any\"",
      "    msg := sprintf(\"rule %v allows any to any\", [r.id])",
      "}",
      "deny contains msg if {",
      "    some r in input.rules",
      "    r.action == \"allow\"",
      "    not r.ticket",
      "    msg := sprintf(\"rule %v has no change ticket\", [r.id])",
      "}"
     ],
     "note": "The pipeline evaluates the proposed rule set as input and fails the build if `deny` contains any message. Policies are tested and reviewed like any other code."
    },
    {
     "type": "flow",
     "title": "A policy-as-code pipeline",
     "items": [
      {
       "label": "Commit",
       "text": "Engineer proposes a change in version control"
      },
      {
       "label": "Test",
       "text": "Syntax checks, unit tests and policy-as-code evaluation"
      },
      {
       "label": "Review",
       "text": "Peer review and approval recorded on the change"
      },
      {
       "label": "Stage",
       "text": "Deploy to lab, then a canary group"
      },
      {
       "label": "Deploy",
       "text": "Roll out to production automatically"
      },
      {
       "label": "Verify",
       "text": "Post-deployment checks and continuous drift detection"
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "A wrong rule pushed by hand breaks one device; pushed by a pipeline it breaks hundreds. Store credentials in a secrets vault, give automation accounts least-privilege API scopes, stage deployments, keep tested rollback, and alert when the running configuration drifts from the approved source.",
     "title": "Automation multiplies mistakes too"
    },
    {
     "type": "text",
     "text": "**AI-assisted security operations** can summarise long alert histories, draft hunting queries, explain unfamiliar scripts, suggest triage steps and write first drafts of incident reports. Used well, it shortens the path from alert to understanding. Used carelessly, it leaks sensitive data, invents facts, or takes actions based on content an attacker controls. Expert teams adopt it under explicit guardrails."
    },
    {
     "type": "framework",
     "title": "Guardrails for AI assistance in the SOC",
     "items": [
      {
       "label": "HITL",
       "title": "Human in the loop",
       "text": "Assistants recommend; people approve any containment, blocking or account action."
      },
      {
       "label": "PRIV",
       "title": "Least privilege",
       "text": "Tool access is read-only by default and scoped to the data the task needs."
      },
      {
       "label": "DATA",
       "title": "Data handling",
       "text": "Only approved services may process incident data; secrets and personal data are redacted where possible."
      },
      {
       "label": "GRND",
       "title": "Grounding",
       "text": "Outputs cite the specific events, logs or documents they rely on, so analysts can verify them."
      },
      {
       "label": "INJ",
       "title": "Untrusted input",
       "text": "Emails, web pages and logs may contain instructions planted by attackers; they are treated as data, never as commands."
      },
      {
       "label": "EVAL",
       "title": "Evaluation",
       "text": "Accuracy is tested against known cases before and after changes, and errors are tracked."
      },
      {
       "label": "LOG",
       "title": "Audit",
       "text": "Prompts, outputs and resulting actions are logged for review."
      }
     ]
    },
    {
     "type": "scenario",
     "situation": "An analyst proposes connecting an AI assistant to the firewall API so it can read incoming alerts and automatically block any IP address it judges malicious. What is the best response?",
     "options": [
      {
       "text": "Let the assistant recommend blocks with cited evidence, and route them through the existing SOAR approval and allow-list guardrails before any change is made.",
       "feedback": "Best. It captures the speed benefit while keeping human approval, protected allow lists and audit, and it limits the impact of manipulated alert content.",
       "best": true
      },
      {
       "text": "Approve it, because automated blocking is faster than any human and attackers move quickly.",
       "feedback": "Alert content can be attacker-controlled; an unsupervised assistant with write access could be steered into blocking critical services.",
       "best": false
      },
      {
       "text": "Ban AI assistance in the SOC entirely, because any use creates unacceptable risk.",
       "feedback": "Discards real productivity gains that can be captured safely with guardrails.",
       "best": false
      },
      {
       "text": "Allow it only at night, when fewer analysts are available to review alerts manually.",
       "feedback": "Removes oversight exactly when it is weakest, which increases rather than reduces the risk.",
       "best": false
      }
     ],
     "title": "Letting an assistant block IPs"
    },
    {
     "type": "checklist",
     "title": "Automation readiness",
     "items": [
      "Source of truth for policy kept in version control",
      "Automation credentials in a secrets vault with least-privilege scopes",
      "Policy-as-code checks run on every proposed change",
      "Lab and canary stages before production deployment",
      "Tested rollback for every automated change type",
      "Drift detection comparing running and approved configuration",
      "AI assistance limited to recommendations with logged, approved actions"
     ]
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Policy-as-code",
       "def": "Expressing security and compliance rules as machine-evaluated code that is versioned, tested and enforced in pipelines."
      },
      {
       "term": "Prompt injection",
       "def": "Instructions hidden in content processed by an AI system that attempt to make it act against its operator's intent."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "Why is a read-only rule audit usually the best first automation project?",
       "options": [
        "It requires no API access, so it can run on any workstation in the company",
        "It delivers value and builds trust without any risk of changing production",
        "It replaces the need for change control because it does not modify devices",
        "It automatically fixes risky rules, so engineers no longer need to review them"
       ],
       "answer": 1,
       "explain": "Read-only automation proves value safely. It still needs API access and does not fix anything by itself."
      },
      {
       "q": "In the Rego example, what happens when a proposed rule allows traffic and has no ticket field?",
       "options": [
        "The rule is allowed because only any-to-any rules are checked by the policy",
        "Open Policy Agent adds a ticket number automatically and approves it",
        "The deny set contains a message, so the pipeline fails the change",
        "The rule is deployed but flagged for review after the next audit cycle"
       ],
       "answer": 2,
       "explain": "The second rule adds a message for any allow rule without a ticket, and the pipeline treats a non-empty deny set as failure."
      },
      {
       "q": "Which practice most reduces the blast radius of a faulty automated change?",
       "options": [
        "Running the automation only from a senior engineer's laptop",
        "Deploying all changes at once so problems appear immediately",
        "Disabling logging during deployment to improve automation speed",
        "Staged deployment to lab and canary groups with tested rollback"
       ],
       "answer": 3,
       "explain": "Staging limits how many devices a mistake can affect before it is caught, and rollback restores service quickly."
      },
      {
       "q": "An AI assistant summarising a phishing email suggests disabling the CFO's account, citing text inside the email. What is the main risk?",
       "options": [
        "The email content may contain planted instructions, so the suggestion must be verified independently",
        "The assistant cannot read email headers, so its summary will always be incomplete and misleading",
        "AI assistants are not able to recommend actions involving executive accounts",
        "The CFO's account will be disabled automatically once the summary is saved"
       ],
       "answer": 0,
       "explain": "Content under attacker control is untrusted input. Recommendations based on it need independent verification and human approval."
      },
      {
       "q": "What does drift detection compare?",
       "options": [
        "The current alert volume against last year's alert volume in the SIEM",
        "The firewall vendor's latest software release against the installed version",
        "The running configuration against the approved configuration in version control",
        "The number of rules on one firewall against the number on its peer"
       ],
       "answer": 2,
       "explain": "Drift is any difference between what is running and what was approved, often caused by manual changes."
      }
     ]
    }
   ]
  },
  {
   "id": "m8-l5",
   "title": "Mock Expert Lab, Exam Strategy and Capstone",
   "subtitle": "Bring all eight layers together under time pressure, then plan your capstone defence",
   "minutes": 50,
   "objectives": [
    "Work through a multi-layer incident and design lab under exam-style constraints.",
    "Apply a structured strategy to scenario and log-interpretation questions.",
    "Plan a capstone that demonstrates the full Defence-in-Depth Stack."
   ],
   "blocks": [
    {
     "type": "text",
     "text": "The expert assessment does not test layers in isolation. It gives you an organisation, a set of evidence and a list of tasks that cut across the **Architect, Perimeter, Tunnel, Identity, Detect, Cloud, Respond** layers and the **ZeroTrust** wrapper. This mock lab uses a fictional firm, Kestrel Financial Services: 4,500 staff, two data centres, 60 branches on SD-WAN, a cloud landing zone and a dozen SaaS platforms. Allow eight hours and write down your evidence for every task."
    },
    {
     "type": "table",
     "title": "Mock lab tasks",
     "head": [
      "Layer",
      "Task",
      "Points",
      "Evidence expected"
     ],
     "rows": [
      [
       "Architect",
       "Produce a zone and trust-boundary diagram for the payments platform",
       "10",
       "Diagram with zones, flows and control points"
      ],
      [
       "Perimeter",
       "Rewrite the edge policy to remove any-any rules and add application-based controls",
       "10",
       "Rule set diff and test results"
      ],
      [
       "Tunnel",
       "Replace pre-shared keys on partner tunnels with certificates",
       "8",
       "Tunnel status and certificate details"
      ],
      [
       "Identity",
       "Enforce phishing-resistant MFA and block legacy authentication",
       "10",
       "Policy export and sign-in log samples"
      ],
      [
       "Detect",
       "Write and tune two detections for the evidence pack",
       "12",
       "Use-case cards and test alerts"
      ],
      [
       "Cloud",
       "Fix public storage and open management ports; add guardrails",
       "10",
       "Posture report before and after"
      ],
      [
       "Respond",
       "Build the incident timeline and contain the intrusion",
       "25",
       "Timeline, actions, evidence log"
      ],
      [
       "ZeroTrust",
       "Propose a 12-month roadmap for the payments platform",
       "15",
       "Maturity tracker and outcome metrics"
      ]
     ]
    },
    {
     "type": "cli",
     "title": "Lab evidence pack: what happened overnight?",
     "device": "Kestrel SIEM · normalised events (UTC)",
     "lines": [
      "2026-05-11T01:58:12Z idp   signin user=svc-backup src=198.51.100.23 result=success auth=legacy-basic mfa=none",
      "2026-05-11T02:01:47Z edr   host=BKP-SRV-02 user=svc-backup proc=powershell.exe parent=wsmprovhost.exe",
      "2026-05-11T02:03:05Z edr   host=BKP-SRV-02 proc=7z.exe cmd=\"a -p archive01.7z D:\\Exports\\Clients\\\"",
      "2026-05-11T02:04:02Z dns   client=10.40.8.15 q=upload.quickfiles-drop.example rcode=NOERROR first_seen=true",
      "2026-05-11T02:06:15Z swg   src=10.40.8.15 host=upload.quickfiles-drop.example category=file-sharing action=allow",
      "2026-05-11T02:41:55Z fw    src=10.40.8.15 dst=203.0.113.77:443 bytes_out=46.8GB duration=2147s",
      "2026-05-11T03:10:30Z idp   signin user=svc-backup src=198.51.100.23 result=success auth=legacy-basic mfa=none"
     ],
     "note": "BKP-SRV-02 is 10.40.8.15. Read the sequence as a story: valid account through legacy authentication without MFA, remote PowerShell, password-protected archive of client exports, first-seen file-sharing domain and a 46.8 GB upload."
    },
    {
     "type": "table",
     "title": "Mapping the evidence",
     "head": [
      "Time",
      "Observation",
      "ATT&CK",
      "Control that failed or was missing"
     ],
     "rows": [
      [
       "01:58",
       "Service account signs in with legacy authentication, no MFA",
       "T1078 Valid Accounts",
       "Legacy authentication not blocked; service account usable interactively"
      ],
      [
       "02:01",
       "Remote PowerShell session on the backup server",
       "T1021.006 Windows Remote Management",
       "Admin protocols not restricted to jump hosts"
      ],
      [
       "02:03",
       "Password-protected archive of client exports",
       "T1560.001 Archive via Utility",
       "No detection for archiving sensitive shares"
      ],
      [
       "02:06 to 02:41",
       "46.8 GB uploaded to a first-seen file-sharing site",
       "T1567.002 Exfiltration to Cloud Storage",
       "File-sharing category allowed for servers; no upload DLP"
      ]
     ]
    },
    {
     "type": "scenario",
     "situation": "It is 03:15 and the second sign-in has just happened. You have authority to act. Which action set comes first?",
     "options": [
      {
       "text": "Reimage BKP-SRV-02 immediately so the attacker loses their foothold before more data leaves.",
       "feedback": "Destroys evidence and leaves the stolen credential and the legacy authentication path open for another server.",
       "best": false
      },
      {
       "text": "Disable svc-backup and revoke its sessions, block legacy auth and the upload domain, and isolate BKP-SRV-02 preserving evidence.",
       "feedback": "Best. It removes the attacker's access path, stops further exfiltration and preserves the evidence needed to scope what was taken.",
       "best": true
      },
      {
       "text": "Email all staff to warn them about a possible data breach and ask them to change their passwords.",
       "feedback": "Premature, alarms staff without containing anything, and does nothing about a service account.",
       "best": false
      },
      {
       "text": "Raise the alert to SEV1 and wait for the morning change advisory board to approve the containment actions before doing anything.",
       "feedback": "Declaring severity is right, but waiting hours for a routine change board lets the intrusion continue.",
       "best": false
      }
     ],
     "title": "First containment move in the mock lab"
    },
    {
     "type": "steps",
     "title": "A method for an eight-hour expert lab",
     "items": [
      {
       "title": "Read everything first",
       "text": "Spend the first 20 minutes reading all tasks and evidence; note dependencies between them."
      },
      {
       "title": "Map tasks to layers",
       "text": "Use the Defence-in-Depth Stack to see which tasks share data and which must come first."
      },
      {
       "title": "Verify the starting state",
       "text": "Check what is already configured before changing it; record baseline evidence."
      },
      {
       "title": "Secure the points",
       "text": "Do high-value and prerequisite tasks first; do not sink an hour into a two-point task."
      },
      {
       "title": "Verify every task",
       "text": "Show proof: a show command, a log entry, a test alert, a screenshot of policy."
      },
      {
       "title": "Reserve review time",
       "text": "Keep the last 30 minutes to re-check evidence, save configurations and complete documentation."
      }
     ]
    },
    {
     "type": "table",
     "title": "Exam question types and how to approach them",
     "head": [
      "Question type",
      "Signal in the stem",
      "Approach"
     ],
     "rows": [
      [
       "Log interpretation",
       "A block of events or headers",
       "Build the timeline first, then map each line to a layer and technique"
      ],
      [
       "FIRST action",
       "'What should you do first?'",
       "Prefer actions that stop harm and preserve evidence over cleanup or reporting"
      ],
      [
       "BEST design",
       "Constraints on cost, latency or legacy",
       "Choose the option that meets every stated constraint, not the most powerful"
      ],
      [
       "Root cause",
       "'Why did the control not stop it?'",
       "Identify the layer and the exact mechanism that was bypassed or absent"
      ],
      [
       "Metric calculation",
       "Times, counts or rates",
       "Write the formula, substitute carefully, check units"
      ]
     ]
    },
    {
     "type": "keypoints",
     "title": "Habits of expert candidates",
     "items": [
      "Read the last line of the stem first so you know what is being asked.",
      "Underline constraints: latency, budget, unmanaged devices, legacy, regulation.",
      "Eliminate options that are illegal, unsafe, destroy evidence or ignore a stated constraint.",
      "Prefer layered, proportionate answers over a single heroic control.",
      "Be wary of absolute options containing 'always', 'never' or 'all'.",
      "Never change an answer without a concrete reason found in the stem."
     ]
    },
    {
     "type": "framework",
     "title": "Capstone deliverables",
     "items": [
      {
       "label": "ARCH",
       "title": "Reference architecture",
       "text": "Zones, trust boundaries and control points for a realistic organisation, mapped to every stack layer."
      },
      {
       "label": "POL",
       "title": "Policy set",
       "text": "Representative firewall, VPN, identity, SSE and segmentation policies with rationale."
      },
      {
       "label": "DET",
       "title": "Detection and response pack",
       "text": "Five use-case cards, two SOAR playbooks with guardrails and one IR playbook."
      },
      {
       "label": "ZT",
       "title": "Zero trust roadmap",
       "text": "Maturity assessment, three-horizon plan and outcome metrics."
      },
      {
       "label": "DEF",
       "title": "Oral defence",
       "text": "A 20-minute presentation and questions on trade-offs and residual risk."
      }
     ]
    },
    {
     "type": "template",
     "title": "Capstone planning sheet",
     "purpose": "Plan your capstone layer by layer so every design decision has evidence and every gap is owned.",
     "columns": [
      "Stack layer",
      "Current gap",
      "Design decision",
      "Control and configuration evidence",
      "Detection and response coverage",
      "Residual risk and owner"
     ],
     "example": [
      [
       "Identity",
       "Service accounts allow legacy authentication",
       "Block legacy auth; service accounts restricted to named hosts",
       "Conditional access export; sign-in logs",
       "Alert on any legacy-auth attempt; playbook to disable and rotate",
       "Two vendor appliances still need basic auth; ops lead accepts until Q2"
      ]
     ],
     "rows": 8
    },
    {
     "type": "checklist",
     "title": "Capstone submission checklist",
     "items": [
      "Every stack layer appears in the architecture with at least one control",
      "Each policy has a stated purpose and a test or verification result",
      "Detections map to ATT&CK and include known false positives",
      "Automation includes approvals, allow lists and rollback",
      "The zero trust roadmap has dated targets and outcome metrics",
      "Residual risks are named, owned and accepted by the right person",
      "No real customer data, credentials or internal addresses are included"
     ]
    },
    {
     "type": "reflection",
     "prompt": "Looking back across all eight layers, where is your own organisation thinnest today? Write the first three actions you would take in the next 90 days and the evidence that would show they worked."
    },
    {
     "type": "terms",
     "items": [
      {
       "term": "Defence in depth",
       "def": "Layering independent controls so that the failure or bypass of one does not expose the protected asset."
      },
      {
       "term": "Residual risk",
       "def": "The risk that remains after controls are applied, which must be owned and formally accepted."
      },
      {
       "term": "Compensating control",
       "def": "An alternative control that reduces risk when the preferred control cannot be implemented."
      }
     ]
    },
    {
     "type": "quiz",
     "items": [
      {
       "q": "In the mock lab evidence, which single missing control would most likely have prevented the initial access?",
       "options": [
        "Allowing the file-sharing category only for workstations and never for servers",
        "Blocking legacy authentication so the account could not sign in without MFA",
        "Collecting DNS logs from the backup server subnet at a higher sampling rate",
        "Adding the upload domain to the response policy zone after the incident"
       ],
       "answer": 1,
       "explain": "The intrusion began with a legacy-auth sign-in that bypassed MFA. Other controls would have limited later stages but not the entry."
      },
      {
       "q": "Which ATT&CK technique best describes the 46.8 GB upload to a file-sharing site?",
       "options": [
        "T1560.001 Archive via Utility",
        "T1071.004 Application Layer Protocol: DNS",
        "T1490 Inhibit System Recovery",
        "T1567.002 Exfiltration to Cloud Storage"
       ],
       "answer": 3,
       "explain": "The upload of data to a web storage service is exfiltration to cloud storage. Archiving happened earlier, and DNS and recovery inhibition are not shown."
      },
      {
       "q": "A question asks for the FIRST action during an active intrusion. Which kind of answer is usually strongest?",
       "options": [
        "One that rebuilds affected systems from scratch",
        "One that notifies every employee immediately",
        "One that stops harm while preserving evidence",
        "One that schedules a full audit for next month"
       ],
       "answer": 2,
       "explain": "Containment with evidence preservation comes before rebuilding, broad communication or audits."
      },
      {
       "q": "A design question states that branch users need low latency, the budget is fixed and IoT devices cannot run agents. How should you choose between options?",
       "options": [
        "Pick the option meeting every stated constraint, even if another is more powerful",
        "Pick the option with the most security features, because security outweighs constraints",
        "Pick the cheapest option, because the budget is the only constraint that is fixed",
        "Pick the option that uses agents, because agents provide the best posture data"
       ],
       "answer": 0,
       "explain": "Expert design questions reward meeting all constraints. Agent-based options fail the IoT constraint."
      },
      {
       "q": "Why must residual risk in a capstone be named and owned?",
       "options": [
        "Residual risk must be zero before a design can be submitted for assessment",
        "Someone with authority must knowingly accept what the controls do not remove",
        "Naming residual risk transfers it automatically to the cyber insurance provider",
        "Owners of residual risk are responsible for fixing it within thirty days"
       ],
       "answer": 1,
       "explain": "Every design leaves some risk. Accountability means the right person accepts it explicitly, with review."
      }
     ]
    }
   ]
  }
 ]
});
TRACK.exam.push([
 {
  "module": "m5",
  "q": "An inline IPS at the internet edge fails during a firmware upgrade and all internet access stops for 40 minutes. The design document does not mention failure behaviour. What should the security architect change FIRST?",
  "options": [
   "Move the IPS to a SPAN port permanently so that it can never interrupt internet traffic again",
   "Disable firmware upgrades on the IPS so that the device stays on its current software version",
   "Replace the IPS with a reputation-only DNS filter so that no inline device is needed at the edge",
   "Decide fail-open or fail-closed per link, add bypass or clustering, and test failover"
  ],
  "answer": 3,
  "explain": "Failure behaviour must be a deliberate, documented and tested design decision with bypass or redundancy. Giving up prevention, freezing upgrades or removing inspection trades one risk for a bigger one."
 },
 {
  "module": "m5",
  "q": "A Suricata `threshold.config` contains `suppress gen_id 1, sig_id 1000201` with no `track` or `ip` parameters. What is the effect, and why is it a concern?",
  "options": [
   "The rule only fires once per day for each source, which delays detection of repeated attacks",
   "The rule is converted to a drop rule, which may block legitimate traffic in IPS mode",
   "The signature is silenced for all traffic, so coverage is lost everywhere, not for one source",
   "The rule is ignored by the parser, so the suppression has no effect and noise continues"
  ],
  "answer": 2,
  "explain": "A suppress entry without track and ip silences the signature entirely. Expert tuning scopes suppression to the specific approved source and records a ticket and review date."
 },
 {
  "module": "m5",
  "q": "Headers on a reported message show `spf=fail smtp.mailfrom=bank.example; dkim=pass header.d=bank.example; dmarc=pass header.from=bank.example`. The message was forwarded by a university alias. What explains the results?",
  "options": [
   "The message is spoofed because any SPF failure means DMARC must also fail",
   "Forwarding broke SPF, but the intact aligned DKIM signature let DMARC pass",
   "DMARC passed because the university alias is listed in the bank's SPF record",
   "DKIM passed only because the forwarder re-signed the message with its own key"
  ],
  "answer": 1,
  "explain": "DMARC needs either SPF or DKIM to pass with alignment. The forwarder's IP is not authorised, so SPF fails, but the bank's DKIM signature survived, so DMARC passes."
 },
 {
  "module": "m5",
  "q": "The SOC sees hundreds of NXDOMAIN responses per minute from one laptop for names such as `qk3vz8lw1p.example` and `t9m2xr0hya.example`. What is the most likely explanation and best next step?",
  "options": [
   "DGA malware; contain the laptop through EDR and check whether any generated name resolved",
   "A misconfigured search suffix on the laptop; push a corrected DHCP option to the whole subnet",
   "A browser prefetching links from a busy news site; tune the alert to ignore NXDOMAIN responses",
   "A DNS server outage upstream; fail over the laptop to a public resolver until it recovers"
  ],
  "answer": 0,
  "explain": "Bursts of failed lookups for random-looking names are typical of DGA malware searching for a live command server. Any successful resolution shows where it connected. Sending the host to a public resolver would bypass protection."
 },
 {
  "module": "m5",
  "q": "A rule detects 18 of 20 simulated attacks in a purple-team exercise. In production it raised 900 alerts last month, of which 30 were true positives. Which statement is correct?",
  "options": [
   "Recall is 90% but precision is about 3%, so the rule needs tuning rather than removal",
   "Precision is 90% but recall is about 3%, so the rule misses most of the real attacks it sees",
   "Both recall and precision are about 90%, so the alert volume is acceptable",
   "Recall cannot be calculated because purple-team tests are not real attacks"
  ],
  "answer": 0,
  "explain": "Recall = 18/20 = 90%. Precision = 30/900, about 3.3%. The rule catches attacks but is too noisy, which calls for tuning. Controlled tests are the normal way to estimate recall."
 },
 {
  "module": "m5",
  "q": "An EDR alert shows `excel.exe` spawning `powershell.exe` with an encoded command, followed by a connection to a first-seen domain. The host is a finance laptop. Which response is most appropriate?",
  "options": [
   "Delete the Excel file from the user's mailbox and close the alert because the attachment was the cause",
   "Ask the user to reboot the laptop so that any malicious process in memory is cleared before work",
   "Add the domain to the proxy block list and wait to see whether the alert repeats tomorrow",
   "Isolate the laptop, collect triage data, block the domain and scope other hosts for the pattern"
  ],
  "answer": 3,
  "explain": "An office application launching an encoded script interpreter that then calls a new domain is a strong compromise indicator (T1059.001). Containment, evidence collection, indicator blocking and scoping belong together; rebooting destroys volatile evidence."
 },
 {
  "module": "m5",
  "q": "A database row containing a fake customer record with a unique email address is planted in the CRM. Weeks later, that address receives a phishing email. What does this most likely indicate?",
  "options": [
   "The email gateway is misconfigured, because it delivers mail to unknown recipients",
   "CRM data has been exfiltrated or exposed, because the honeytoken had no legitimate use",
   "The phishing campaign is random, because attackers guess addresses at large scale",
   "The CRM backup is corrupted, because fake records should never leave the database"
  ],
  "answer": 1,
  "explain": "The record exists only in the CRM, so mail to its unique address strongly suggests the data left the system. That is the purpose of a data honeytoken."
 },
 {
  "module": "m5",
  "q": "Managed laptops resolve almost nothing through the corporate resolver, yet browse normally. The protective DNS policy is therefore ineffective. What is the best corrective set?",
  "options": [
   "Lower the corporate resolver's cache TTL so that laptops are forced to query it more often throughout the day",
   "Publish DNSSEC signatures for the corporate zones so that browsers prefer the corporate resolver automatically",
   "Set browser DoH policy to the corporate resolver, block public DoH and DoT endpoints, and alert on bypass",
   "Block all outbound UDP traffic from laptops so that every DNS lookup must use the corporate resolver over TCP"
  ],
  "answer": 2,
  "explain": "The laptops are using encrypted DNS directly. Browser policy plus blocking known DoH and DoT endpoints restores control, and bypass detection catches the rest. TTLs and DNSSEC do not affect resolver choice."
 },
 {
  "module": "m6",
  "q": "A cloud database subnet ACL allows inbound TCP 5432 from the application subnet and has an explicit outbound deny-all. The security groups are correct. Applications time out. What is the fix?",
  "options": [
   "Add an inbound security group rule allowing ephemeral ports from the application subnet",
   "Add an outbound ACL rule allowing TCP ephemeral ports back to the application subnet",
   "Change the database security group to reference the subnet ACL instead of the app group",
   "Remove the security groups, because subnet ACLs and security groups cannot be combined"
  ],
  "answer": 1,
  "explain": "Subnet ACLs are stateless, so return traffic needs its own outbound rule. Security groups are stateful and already allow the reply."
 },
 {
  "module": "m6",
  "q": "Staff are copying files from the corporate tenant of a SaaS storage platform to personal accounts on the same platform. Blocking the platform is not acceptable. Which control addresses this most directly?",
  "options": [
   "Tenant restrictions on the inline proxy allowing only corporate-tenant sign-ins",
   "API-mode CASB scanning the corporate tenant weekly for files shared with outsiders",
   "URL filtering that blocks the platform's domain for everyone except the IT department",
   "A DNS policy that sinkholes the platform's personal sign-in page for managed laptops"
  ],
  "answer": 0,
  "explain": "Tenant restriction distinguishes corporate and personal instances on the same domain in real time. API scanning sees only the corporate tenant, and domain or DNS blocks would also break the corporate tenant."
 },
 {
  "module": "m6",
  "q": "A company must give 300 freelance translators on personal laptops access to one internal web portal. No agents may be installed. Which design is best?",
  "options": [
   "Issue full-tunnel remote-access VPN profiles and restrict them with a large access list",
   "Expose the portal directly on the internet behind a web application firewall only",
   "Build site-to-site IPsec tunnels to the home routers of each of the 300 translators working from home",
   "Publish the portal through agentless browser-based ZTNA with MFA and session controls"
  ],
  "answer": 3,
  "explain": "Agentless ZTNA publishes one application to unmanaged devices with identity checks, without giving network access or exposing the portal openly."
 },
 {
  "module": "m6",
  "q": "After moving 60 branches to direct-to-cloud access through a security service edge, a payroll SaaS rejects all branch logins. It worked last week. What is the most likely cause?",
  "options": [
   "The SD-WAN appliances are dropping TLS 1.3 handshakes to all SaaS providers",
   "The branch users' MFA tokens expired because their time zones changed",
   "The SaaS allow-lists the old data-centre egress IPs, and traffic now leaves from the PoP",
   "The security edge blocks every application in the human resources category"
  ],
  "answer": 2,
  "explain": "When egress moves to the PoP, source IPs change. Registering dedicated PoP egress addresses with the SaaS provider fixes it; the other causes would affect far more than one app."
 },
 {
  "module": "m6",
  "q": "An API returns another customer's order when a client changes `orderId` in the URL. The token is valid and correctly scoped. The team proposes adding a WAF signature. Why is that insufficient?",
  "options": [
   "The flaw is broken object level authorisation, which only an ownership check in the service can fix",
   "The flaw is server-side request forgery, which only an egress firewall placed in front of the API can fix",
   "The flaw is an expired token, which only a shorter token lifetime at the identity provider can fix",
   "The flaw is rate limiting, which only a stricter per-client quota at the gateway can fix"
  ],
  "answer": 0,
  "explain": "This is API1, BOLA. The WAF cannot know who owns which order; the service must check ownership on every request."
 },
 {
  "module": "m6",
  "q": "SaaS audit logs show that a 'calendar helper' app, granted mail read permissions by 40 users, is downloading mailbox contents. Passwords for all 40 users were reset yesterday. What should happen next?",
  "options": [
   "Reset the 40 passwords again and force MFA re-registration for each affected user before their next sign-in",
   "Block the app's publisher domain at the web gateway so users cannot reach its website",
   "Ask the 40 users to remove the app from their own account settings within a week",
   "Revoke the app's consent and tokens tenant-wide and require admin approval for such permissions"
  ],
  "answer": 3,
  "explain": "OAuth grants survive password resets. Tenant-wide revocation stops the access immediately, and admin consent prevents repeat grants."
 },
 {
  "module": "m6",
  "q": "A posture tool keeps finding storage buckets made public by different teams, and each is fixed within a day. Which improvement gives the greatest risk reduction?",
  "options": [
   "A daily report of public buckets emailed to the cloud centre of excellence",
   "A faster posture scan interval so findings appear within five minutes",
   "An organisation-level guardrail that prevents public access from being enabled",
   "A training module on storage permissions for every cloud engineer"
  ],
  "answer": 2,
  "explain": "Preventive guardrails remove the exposure window completely. Faster detection and training still leave public data reachable for some time."
 },
 {
  "module": "m7",
  "q": "An investigator finds that firewall and EDR events for the same connection differ by exactly one hour. What is the most likely cause, and how should it be fixed?",
  "options": [
   "The SIEM ingests firewall logs in hourly batches; switch the firewall export to real-time streaming",
   "One source logs local time without a zone; standardise on UTC with explicit offsets",
   "EDR agents buffer events for an hour on purpose; reduce the agent buffer setting on every host",
   "NTP servers drift by an hour each day; replace them with a GPS-backed time source"
  ],
  "answer": 1,
  "explain": "An exact one-hour offset points to time-zone or daylight-saving handling, not drift or batching. UTC with explicit offsets everywhere removes it."
 },
 {
  "module": "m7",
  "q": "A sign-in log shows 2,400 failures from one IP against 1,600 different usernames in 50 minutes, followed by one success for `j.ahmed` and a new MFA method registered two minutes later. Which interpretation is best?",
  "options": [
   "Spraying led to a valid login and MFA persistence; revoke sessions and remove the new method",
   "A brute-force attack against j.ahmed succeeded; lock that account, reset its password and close the case",
   "A misconfigured application is retrying stored credentials; fix the app's service account",
   "Users mistyped passwords after a policy change; the success shows the change has settled"
  ],
  "answer": 0,
  "explain": "Many distinct users from one source is spraying (T1110.003); the success and new MFA method show valid-account use and persistence. Response must revoke sessions and the attacker's MFA method, not just lock the account."
 },
 {
  "module": "m7",
  "q": "Flow records show an internal server sending 300-byte HTTPS requests to the same external IP every 600 seconds, plus or minus 3 seconds, for nine days. Which hunting conclusion is most justified?",
  "options": [
   "The traffic is encrypted, so flow records cannot support any conclusion about its nature",
   "The small request size proves it is a benign health check that can be excluded from future hunts permanently",
   "The regular, low-jitter pattern suggests beaconing and should be investigated with endpoint data",
   "The nine-day duration proves an active data exfiltration that must be reported to regulators"
  ],
  "answer": 2,
  "explain": "Regular timing and consistent size are classic beacon indicators, but benign software can behave similarly. Endpoint data identifies the process before drawing firm conclusions."
 },
 {
  "module": "m7",
  "q": "A SOAR playbook isolated 140 endpoints in four minutes after a threat feed wrongly listed a widely used software update domain. Which design change best prevents a repeat?",
  "options": [
   "Faster rollback scripts so that wrongly isolated endpoints can be released within a few minutes of the error",
   "Rate limits and approval gates on bulk isolation, plus a protected allow list of critical domains",
   "Removing all threat feeds so that the playbook relies only on internal intelligence",
   "Running the playbook only at night so that fewer users notice any wrongly isolated hosts"
  ],
  "answer": 1,
  "explain": "Guardrails stop the damage before it happens: allow lists protect known-good infrastructure, and limits plus approvals prevent mass action on one indicator. Rollback helps but only after harm."
 },
 {
  "module": "m7",
  "q": "During a ransomware incident, an engineer proposes powering off the affected file server to stop encryption. The incident lead wants memory evidence. What is the best approach?",
  "options": [
   "Power off immediately, because memory evidence is never useful in ransomware cases",
   "Leave the server running and connected so the attacker does not realise they were seen",
   "Take a disk image first, then capture memory once the disk image has been hashed and verified",
   "Isolate the server through EDR to stop spread, capture memory, then decide on shutdown"
  ],
  "answer": 3,
  "explain": "Network isolation halts spread without losing volatile evidence. Memory comes before disk in the order of volatility, and leaving the server connected allows more damage."
 },
 {
  "module": "m7",
  "q": "Four incidents had dwell times of 3, 5, 7 and 85 days. The board report shows mean dwell time only. What should the security lead change?",
  "options": [
   "Remove the 85-day incident from the data because it is not representative of normal performance",
   "Report the mean of 25 days as the headline figure because it is the most conservative number",
   "Stop reporting dwell time because the figures vary too much between incidents to be useful",
   "Report the median (6 days) and the outlier separately, and investigate why one case took 85 days"
  ],
  "answer": 3,
  "explain": "The mean of 25 days is skewed by one outlier; the median of 6 shows typical performance. The outlier is where the lessons are, so it must be explained, not hidden."
 },
 {
  "module": "m7",
  "q": "A hunt based on the hypothesis 'attackers use scheduled tasks for persistence on Linux servers' finds no evidence, but reveals that cron changes are not logged. What is the correct outcome?",
  "options": [
   "Record a data gap with an owner and plan to collect cron changes, then re-run the hunt",
   "Record that Linux servers are free of scheduled-task persistence for this quarter",
   "Close the hunt as unsuccessful and remove the hypothesis from the hunting backlog",
   "Write a detection for cron persistence and mark the technique as fully covered"
  ],
  "answer": 0,
  "explain": "No data means no conclusion. A documented, owned data gap is a valid hunt result; a detection without data cannot be counted as coverage."
 },
 {
  "module": "m7",
  "q": "An insurer asks the incident team to prove that a memory image analysed last week is identical to the one collected during containment. What provides that proof?",
  "options": [
   "A screenshot of the analysis tool showing the file name and size of the memory image",
   "An email from the analyst stating that the image was stored on an encrypted drive",
   "Matching SHA-256 hashes recorded at collection and re-verified, plus a custody log",
   "The EDR console's record that a memory collection job completed successfully"
  ],
  "answer": 2,
  "explain": "A recorded hash compared over time proves integrity, and the custody log proves who handled it. Names, sizes and statements do not."
 },
 {
  "module": "m8",
  "q": "In a ZTNA deployment, the identity provider evaluates conditional access, a broker sets up the session and an agent on the laptop tunnels traffic to an app connector. Which NIST SP 800-207 role does the broker play?",
  "options": [
   "Policy engine, deciding whether access is allowed using the trust algorithm",
   "Policy administrator, establishing the session path on the policy engine's decision",
   "Policy information point, supplying device posture and threat intelligence to the engine",
   "Enterprise resource, hosting the application that the subject is trying to reach over the tunnel"
  ],
  "answer": 1,
  "explain": "The broker executes the decision by setting up or tearing down the path and session credentials, which is the policy administrator role. The identity provider's conditional access acts as the policy engine."
 },
 {
  "module": "m8",
  "q": "A user's session token is reused from another country ten minutes after a legitimate sign-in. Access tokens are valid for eight hours, and the applications do not support event-driven revocation. What is the most important improvement?",
  "options": [
   "Require users to sign in again every morning so that tokens issued the day before become invalid",
   "Shorten token lifetimes and adopt continuous access evaluation so risk events revoke sessions",
   "Block all sign-ins from outside the home country so that stolen tokens cannot be replayed abroad",
   "Encrypt the session tokens with a longer key so that they cannot be copied from the user's browser"
  ],
  "answer": 1,
  "explain": "Token theft is defeated by limiting token value over time and revoking on risk signals. Geoblocking is easily bypassed through local proxies, and encryption does not stop replay of a stolen token."
 },
 {
  "module": "m8",
  "q": "A Kubernetes namespace has a NetworkPolicy allowing `app: payments-api` pods to reach `app: payments-db` on TCP 5432, but a test pod with no labels can still connect to the database. What is the most likely reason?",
  "options": [
   "The cluster's network plugin does not enforce NetworkPolicy, so policies have no effect",
   "NetworkPolicy only applies to egress traffic, so ingress traffic to the database is never affected",
   "Unlabelled pods are exempt from NetworkPolicy and must be blocked by a namespace firewall",
   "The policy needs a higher priority number before it overrides the default allow rule"
  ],
  "answer": 0,
  "explain": "Once a pod is selected by an ingress policy, unlisted sources are denied, provided the network plugin enforces policy. If the plugin does not, nothing is enforced. Kubernetes NetworkPolicy has no priority numbers."
 },
 {
  "module": "m8",
  "q": "A pipeline uses policy-as-code to block firewall changes without a ticket. An engineer bypasses the pipeline and adds a rule directly on the device. Which control detects this?",
  "options": [
   "A stricter Rego policy in the pipeline that also checks the engineer's job title",
   "A longer peer-review period for changes submitted through the version control system",
   "A higher API rate limit on the firewall manager so that scripts cannot overload it",
   "Drift detection comparing running configuration with the approved source of truth"
  ],
  "answer": 3,
  "explain": "Policy-as-code only sees changes that go through the pipeline. Drift detection compares what is running with what was approved, exposing manual changes."
 },
 {
  "module": "m8",
  "q": "A zero trust programme wants to protect legacy SCADA engineering workstations that cannot run agents or support MFA. Which approach is best?",
  "options": [
   "Install a ZTNA agent on each workstation using the compatibility mode offered for older operating systems",
   "Exempt them from the zero trust programme because operational technology is out of scope",
   "Put them in an enclave reached only via a privileged access gateway with MFA and session recording",
   "Connect them to the corporate network so that they can receive identity provider policies directly"
  ],
  "answer": 2,
  "explain": "Enclave gateways and privileged access gateways are the standard compensating approach for systems that cannot protect themselves. Exemption leaves the highest-impact systems unprotected."
 },
 {
  "module": "m8",
  "q": "An AI assistant integrated with the SOC reads incoming phishing emails and suggests response actions. One email contains hidden text instructing the assistant to recommend allow-listing the sender's domain. What guardrail matters most?",
  "options": [
   "Increase the assistant's context window so that it can read the entire email thread and attachments before answering",
   "Treat processed content as untrusted data and require human approval for any allow-list or block action",
   "Train analysts to copy each assistant recommendation into the ticket without changing its wording",
   "Allow the assistant to apply allow-list changes only for domains that it has seen at least twice"
  ],
  "answer": 1,
  "explain": "This is prompt injection through attacker-controlled content. Treating that content as data and keeping humans in control of configuration changes neutralises the attempt."
 },
 {
  "module": "m8",
  "q": "Six months into a zero trust roadmap, the board asks for proof of progress. Which metric set is most meaningful?",
  "options": [
   "Number of zero trust products purchased, licences deployed and vendor training sessions completed by staff so far",
   "Number of policy documents updated, steering meetings held and architecture diagrams produced this year",
   "Share of privileged sessions using phishing-resistant MFA, apps behind ZTNA, and time to revoke leaver access",
   "Total zero trust budget spent, headcount added to the programme and consultants engaged so far"
  ],
  "answer": 2,
  "explain": "Outcome metrics show that access decisions have changed and risk has fallen. Purchases, documents and spend measure activity, not effect."
 }
]);
