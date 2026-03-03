"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'admin@cyber.edu';
    const password = 'password123';
    // 0. Clean up
    await prisma.trainingProgress.deleteMany({});
    await prisma.module.deleteMany({});
    await prisma.simulationAttempt.deleteMany({}); // Delete attempts first to clear FK
    await prisma.simulation.deleteMany({});
    // 1. Password hash
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    // 2. Upsert User
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Admin Nodyt',
            passwordHash,
            role: 'ADMIN',
            riskScore: 75,
        },
    });
    console.log(`USER: ${user.email}`);
    // 3. Modules Data
    const modules = [
        {
            title: 'Phishing 101',
            description: 'Advanced analysis of human-centric cyber threats, psychological manipulation, and technical defense.',
            type: 'VIDEO',
            riskReduction: 10,
            videoUrl: 'https://www.youtube.com/embed/XBkzBrXlle0', // Simplilearn: What Is Phishing?
            theory: `# Phishing 101: The Comprehensive Guide to Modern Social Engineering

## 1. Introduction: The Anatomy of a Phishing Attack
Phishing, as defined by the **NIST (National Institute of Standards and Technology)**, is a technique for attempting to acquire sensitive data, such as bank account numbers, through a fraudulent solicitation in email or on a web site, in which the perpetrator masquerades as a legitimate business or reputable person. Unlike technical exploits that target software vulnerabilities, phishing targets the "human operating system," exploiting psychological vulnerabilities to bypass security perimeters.

According to the **CISA (Cybersecurity & Infrastructure Security Agency)**, phishing remains the primary infection vector for over 90% of successful cyberattacks worldwide. Its persistence is due to its adaptability and the inherent trust-based nature of digital communication.

## 2. The Mechanics and Lifecycle of Phishing
The execution of a phishing campaign follows a structured lifecycle:
1.  **Planning and Reconnaissance**: Attackers identify targets. For mass phishing, this involves harvesting email lists from data breaches. For targeted attacks (Spear Phishing), it involves OSINT (Open Source Intelligence) techniques, gathering data from LinkedIn, social media, and professional journals.
2.  **Setup phase**: Creating the "lures." This includes registering homograph domains (e.g., \`paypa1.com\`), setting up SMTP servers, and designing convincing email templates that mirror the branding of trusted entities like Microsoft, Google, or internal HR departments.
3.  **Delivery**: Launching the emails. Modern attackers use evasion techniques like "HTML Smuggling" to hide malicious payloads within legitimate-looking HTML attachments.
4.  **Collection and Exploitation**: Once a victim clicks or enters data, the information is sent to the attacker's Command and Control (C2) server. This can lead to credential theft, financial fraud, or the installation of primary malware payloads like Ransomware.

## 3. Advanced Taxonomy of Phishing Techniques
The threat landscape has evolved beyond simple mass emails into several specialized categories:

### A. Spear Phishing and Whaling
Spear phishing is a highly targeted form of attack. According to **SANS Institute**, these attacks are 10 times more likely to succeed than mass phishing. Attackers use specific details about the recipient—their project names, colleagues, or recent travels—to build an unbreakable facade of legitimacy. **Whaling** is a subset targeting the C-suite (CEOs, CFOs), requiring even higher levels of sophistication in tone and detail.

### B. Business Email Compromise (BEC)
BEC, or "CEO Fraud," is one of the most financially damaging forms of phishing. The **FBI's IC3 (Internet Crime Complaint Center)** reports billions in losses annually due to BEC. It often involves hacking or spoofing a senior executive's account to authorize urgent wire transfers or sensitive data releases. It lacks traditional "malicious" elements (links or attachments), making it invisible to many technical filters.

### C. Smishing and Vishing
As desktop security improves, attackers move to mobile. **Smishing (SMS Phishing)** exploits the high open rate of text messages, often pretending to be package delivery services or bank alerts. **Vishing (Voice Phishing)** uses AI-generated deepfake voices or social engineering over the phone to extract verbal confirmation codes or MFA tokens.

## 4. Psychological Triggers: Why We Fall for It
Social engineers rely on established psychological principles of influence, as documented by Dr. Robert Cialdini:
-   **Authority**: Posing as a government official or senior manager.
-   **Urgency**: "Your account will be suspended in 2 hours." Urgency suppresses the brain's prefrontal cortex, which handles critical thinking.
-   **Scarcity**: Offering a limited-time reward or access.
-   **Social Proof**: Implying that many others in the organization have already complied.

## 5. Technical Indicators and Defense-in-Depth
Detecting modern phishing requires a multi-layered approach as per the **Cisco Security** frameworks:

### A. URL and Link Obfuscation
Attackers use **Homograph attacks**, where Cyrillic or other non-Latin characters are used to create domains that look identical to the original (e.g., \`microsoft.com\` but the 'o' is a Greek omicron). Always hover over links to inspect the actual destination URL in the status bar.

### B. Email Authentication Protocols (SPF, DKIM, DMARC)
Organizations must implement these protocols to prevent spoofing:
-   **SPF (Sender Policy Framework)**: Lists authorized IP addresses for the domain.
-   **DKIM (DomainKeys Identified Mail)**: Adds a digital signature to emails.
-   **DMARC (Domain-based Message Authentication, Reporting, and Conformance)**: Instructs receiving servers on how to handle emails that fail SPF/DKIM.

## 6. Defensive Strategies and Mitigation
The **ENISA (European Union Agency for Cybersecurity)** recommends a combination of:
1.  **Multi-Factor Authentication (MFA)**: Even if credentials are stolen, MFA (preferably hardware keys like Yubikeys) can stop the attack.
2.  **Security Awareness Training**: Regular, simulation-based training to build "human firewalls."
3.  **Endpoint Protection (EDR)**: To detect and block malicious payloads that might be downloaded via a phishing link.

## 7. Case Study: The 2016 DNC Email Leak
One of the most consequential spear-phishing attacks in history targeted the Democratic National Committee. Attackers used a fake Google security alert, claiming someone from Ukraine had the victim's password and they needed to change it "immediately." The link led to a spoofed domain (\`myaccount.google.com-securitysetting.net\`). This single click led to the exfiltration of 50,000+ emails and demonstrated how even high-profile individuals can fall for urgency-based triggers.

## 8. Technical Deep Dive: HTML Smuggling
HTML Smuggling is an increasingly popular technique used by Advanced Persistent Threats (APTs) like NOBELIUM. Instead of sending a malicious file attachment that an email gateway could scan, attackers hide the malware within a chunk of JavaScript inside a legitimate HTML file. When the user opens the HTML, the JavaScript "assembles" the malware on the user's local machine, bypassing traditional boundary defenses. This technique exploits the fundamental way browsers process blobs and file downloads.

## 9. The Role of Artificial Intelligence in Phishing
The emergence of Large Language Models (LLMs) has revolutionized the "Scam-as-a-Service" industry. Historically, phishing could be detected by poor grammar or awkward phrasing. Today, AI allows non-native speakers to generate perfectly written, professional, and personalized lures at scale. Furthermore, AI-driven "Deepfake" audio is used in vishing to impersonate specific individuals' voices with terrifying accuracy, making the "Verification" step more difficult than ever.

## 10. Conclusion: The Eternal Vigilance
Phishing is not a problem that can be "solved" by a single tool. It is an evolving arms race between human ingenuity and deception. By adopting a "Zero Trust" mentality—never trust, always verify—users can significantly reduce their risk profile. Organizations must shift from a "culture of blame" (punishing those who click) to a "culture of transparency" (encouraging rapid reporting of mistakes).

### References & Further Reading:
-   *NIST Special Publication 800-53: Security and Privacy Controls for Information Systems.*
-   *CISA: Phishing Infographic and Defensive Best Practices (cisa.gov).*
-   *FBI IC3 Public Service Announcement on BEC (ic3.gov).*
-   *ENISA Threat Landscape Reports.*
-   *Microsoft Digital Defense Report 2023.*
-   *Mandiant M-Trends Report: The Evolution of HTML Smuggling.*
-   *Cialdini, R. (2006). Influence: The Psychology of Persuasion.*`,
            quizData: JSON.stringify([
                { q: "According to NIST, what is the primary distinction of phishing compared to other attacks?", a: ["It uses hardware vulnerabilities", "It targets human psychological trust", "It only affects Linux systems", "It requires physical access"], c: 1 },
                { q: "What is the setup phase in the phishing lifecycle usually concerned with?", a: ["Executing the payload", "Creating 'lures' like homograph domains", "Reporting to authorities", "Patching software"], c: 1 },
                { q: "What does CISA identify as the percentage of cyberattacks starting with phishing?", a: ["Over 25%", "Over 50%", "Over 90%", "Exactly 10%"], c: 2 },
                { q: "In a BEC (Business Email Compromise) attack, what is typically absent?", a: ["Urgent language", "Malicious links or attachments", "Spoofed sender address", "Sender name"], c: 1 },
                { q: "What is a 'Homograph Attack'?", a: ["An attack on handwriting", "Using similar-looking characters from different alphabets in a URL", "Searching for passwords in paper trash", "Cracking passwords with GPUs"], c: 1 },
                { q: "Which protocol is used to provide a digital signature for email verification?", a: ["SPF", "DKIM", "HTML5", "TCP/IP"], c: 1 },
                { q: "How does 'Urgency' affect the human brain during a social engineering attack?", a: ["It improves logic", "It bypasses critical thinking by triggering the amygdala", "It increases memory retention", "It has no effect"], c: 1 },
                { q: "What is 'Whaling'?", a: ["Phishing targets at sea", "Targeted phishing against high-level executives (C-suite)", "Mass phishing for data centers", "A type of network firewall"], c: 1 },
                { q: "What is the most effective MFA method to stop advanced phishing (Session Hijacking)?", a: ["SMS codes", "Email codes", "Hardware Security Keys (FIDO2)", "Secret questions"], c: 2 },
                { q: "What does the DMARC protocol instruct servers to do?", a: ["Encrypt all emails", "Handle emails that fail SPF/DKIM based on local policy", "Block all attachments", "Speed up email delivery"], c: 1 }
            ])
        },
        {
            title: 'Password Mastery',
            description: 'Advanced credential security, entropy, and identity management strategies.',
            type: 'VIDEO',
            riskReduction: 15,
            videoUrl: 'https://www.youtube.com/embed/3NjQ9b3pgIg', // TED-Ed: How to choose a strong password
            theory: `# Password Mastery: Advanced Identity and Credential Security

## 1. The Science of Password Strength: Entropy
The core of password security lies in **entropy**, a measure of randomness. The more entropy a password has, the higher the computational cost for an attacker to "crack" it. As per **NIST Digital Identity Guidelines (SP 800-63)**, the focus has shifted from arbitrary complexity (mixing symbols and cases) to length and usability.

### A. Brute Force vs. Dictionary Attacks
-   **Brute Force**: Attempting every possible combination. Modern GPUs can try billions of combinations per second.
-   **Dictionary Attacks**: Using pre-computed lists of common passwords and their variations (e.g., \`password123\`, \`P@ssw0rd!\`).

## 2. The Move to Passphrases
The **Electronic Frontier Foundation (EFF)** recommends the use of **Passphrases**. A passphrase (e.g., \`correct-horse-battery-staple\`) often has more entropy than a complex but short password (e.g., \`Tr0ub4dor&3\`) and is significantly easier for the human brain to remember without jotting it down.

## 3. Credential Stuffing and Identity Theft
Attackers use databases from previous breaches (available on the Dark Web) to try the same credentials on other services. This is **Credential Stuffing**. Because 65% of users reuse passwords (according to **Google Security** research), a single breach at a minor site can lead to a compromise of corporate or banking accounts.

## 4. Modern Management: Password Managers and SSO
-   **Password Managers**: Tools like Bitwarden or 1Password allow users to generate high-entropy, unique passwords for every service. NIST now recommends managers as a primary defense.
-   **Single Sign-On (SSO)**: Reduces the "password fatigue" by using a single, highly secured identity provider (e.g., Okta, Microsoft Entra ID).

## 5. Case Study: The 2022 Uber Breach
In 2022, an attacker gained access to Uber's internal systems through a "MFA Fatigue" attack. After obtaining a contractor's password, the attacker sent a barrage of MFA push notifications to their phone. Eventually, the victim, overwhelmed and frustrated, clicked "Accept" to make the notifications stop. This highlights that even with MFA, the human element—fatigue and annoyance—can be exploited.

## 6. Technical Analysis: Salted Hashing
When you create a password, a secure system doesn't store the password itself. It stores a "Hash"—a one-way cryptographic representation. To prevent "Rainbow Table" attacks (where attackers pre-compute billions of hashes), systems use a **Salt**. A salt is a random string added to the password before hashing, ensuring that two identical passwords (like \`123456\`) end up with completely different hashes in the database.

## 7. The Future: FIDO2 and Passwordless
The industry is moving toward **Passwordless** authentication. Using the FIDO2 standard, users can authenticate using their device's local biometrics (FaceID/TouchID) or a hardware key. The private key never leaves the device, making "phishing" for a password impossible because there is no password to steal.

### References:
-   *NIST SP 800-63B: Digital Identity Guidelines - Authentication and Lifecycle Management.*
-   *EFF: Creating Strong Passwords and Passphrases.*
-   *OWASP Top 10: Broken Authentication.*
-   *FIDO Alliance: Passwordless Authentication Standards.*
-   *Microsoft: The End of the Password Era.*
-   *SANS Institute: Securing Your Accounts with MFA.*`,
            quizData: JSON.stringify([
                { q: "What is 'Entropy' in the context of password security?", a: ["The speed of typing", "A measure of randomness and complexity", "The age of a password", "The number of users"], c: 1 },
                { q: "Why does NIST currently favor length over complexity for passwords?", a: ["Short passwords are easier to hack by GPUs", "Users find symbols too hard to find", "Complexity reduces entropy", "Symbols are no longer supported"], c: 0 },
                { q: "What is 'Credential Stuffing'?", a: ["Forcing a password into a field", "Using leaked credentials from one site to attack others", "Hacking a physical safe", "Sending redundant passwords"], c: 1 },
                { q: "According to Google research, what percentage of users reuse passwords?", a: ["10%", "30%", "65%", "95%"], c: 2 },
                { q: "What is the primary advantage of a Passphrase over a complex password?", a: ["It is shorter", "It has high entropy while being easier to remember", "It is only used by admins", "It doesn't require MFA"], c: 1 },
                { q: "Which MFA method is most vulnerable to SIM Swapping?", a: ["Hardware keys", "Authenticator apps", "SMS-based codes", "Biometrics"], c: 2 },
                { q: "What is a 'Dictionary Attack'?", a: ["Learning new words", "Using lists of common and previously leaked passwords", "Attacking the Oxford server", "Guessing passwords alphabetically"], c: 1 },
                { q: "What does SSO (Single Sign-On) help reduce?", a: ["Internet speed", "Password fatigue and attack surface", "Hardware costs", "Electricity usage"], c: 1 },
                { q: "A 'Brute Force' attack is less effective against:", a: ["Short passwords with symbols", "Long, high-entropy passphrases", "Common words", "Birthdays"], c: 1 },
                { q: "What is FIDO2?", a: ["A type of firewall", "An open standard for passwordless authentication", "A brand of antivirus", "A social engineering trick"], c: 1 }
            ])
        },
        {
            title: 'Mobile Security',
            description: 'Securing the endpoint: Mobile operating systems, app ecosystems, and wireless threats.',
            type: 'VIDEO',
            riskReduction: 10,
            videoUrl: 'https://www.youtube.com/embed/ahNb6kA0Lms', // Mobile Security Awareness
            theory: `# Mobile Security: Defending the Personal Perimeter

## 1. The Mobile Threat Landscape
Mobile devices are now the primary computing platform for both personal and professional life. They contain GPS data, camera/microphone access, and financial credentials. The **OWASP Mobile Top 10** highlights the most critical risks, including insecure data storage and insufficient transport layer security.

## 2. Operating System and Application Integrity
Modern mobile OSs (iOS/Android) use "Sandboxing" to prevent apps from accessing each other's data. However, this defense can be bypassed if:
-   **Jailbreaking/Rooting**: Disabling the OS's built-in security controls. This removes the root of trust and exposes the device to kernel-level malware.
-   **Sideloading**: Installing apps from unofficial markets. These apps often lack the "App Review" process of the Apple App Store or Google Play, leading to higher rates of spy-ware and adware.

## 3. Wireless and Network Attacks
Mobile devices are constantly searching for signals, making them vulnerable to:
-   **Evil Twin Access Points**: Malicious Wi-Fi hotspots designed to look like legitimate ones (e.g., "Starbucks_Free_WiFi"). Attackers can perform Man-in-the-Middle (MITM) attacks to decrypt traffic.
-   **Stingrays (IMSI Catchers)**: Devices that mimic cell towers to intercept calls and track locations.
-   **Bluetooth Vulnerabilities**: Techniques like "Bluejacking" and "Bluesnarfing" allow attackers to send spam or steal contact info from unpatched devices.

## 4. Mobile Device Management (MDM)
For organizations, MDM solutions are critical. They allow for "Remote Wipe" capabilities if a device is lost, enforcing PIN policies, and Ensuring that only compliant, un-rooted devices can access corporate email.

## 5. Privacy Hygiene
-   **Permissions**: Regularly audit which apps have access to your "Location," "Contacts," and "Microphone."
-   **Biometrics**: Use biometrics (FaceID/TouchID) combined with strong 6+ digit passcodes.
-   **VPN**: Always use an encrypted tunnel when connecting to non-trusted networks.

## 6. Case Study: The Peggy Spyware (NSO Group)
The Peggy spyware (often associated with the NSO Group's Pegasus) represents the pinnacle of mobile threats. It utilizes "Zero-Click" exploits, meaning the victim does not even need to click a link to be infected. The spyware exploits vulnerabilities in messaging apps like iMessage or WhatsApp to gain root access, allowing it to record calls, read encrypted messages, and track GPS coordinates in real-time. This case study underscores that for high-risk targets, simply being "careful" with links is not enough.

## 7. Technical Deep Dive: Mobile Sandboxing and Kerne-Level Attacks
In a standard mobile environment, each app runs in its own "Sandbox" with a unique User ID (UID). This prevents an app from seeing another app's memory or files. However, kernel-level vulnerabilities (like those used in the "Pangu" jailbreaks or advanced malware) allow an attacker to "escape" the sandbox. Once escaped, the attacker has the same privileges as the operating system itself, rendering all app-level security moot.

## 8. Summary: The Mobile-First Defense
The future of cybersecurity is mobile. As we move toward "Bring Your Own Device" (BYOD) cultures in the workplace, the line between personal and corporate security blurs. Implementing biometric-backed identities and keeping your OS updated is no longer a luxury but a fundamental necessity.

### References:
-   *OWASP Mobile Security Project.*
-   *NIST SP 800-124: Guidelines for Managing the Security of Mobile Devices in the Enterprise.*
-   *Apple/Google Platform Security Documentations.*
-   *Citizen Lab: Research on Zero-Click Mobile Exploits.*
-   *Zimperium: Global Mobile Threat Report.*
-   *Lookout: Mobile Risk Matrix.*`,
            quizData: JSON.stringify([
                { q: "What is 'Sandboxing' in mobile security?", a: ["A game for children", "Isolating apps so they cannot access each other's data", "Storing phones in sand", "A type of firewall", "A secure computer case"], c: 1 },
                { q: "Why is 'Jailbreaking' a security risk?", a: ["It costs money", "It removes the OS's built-in security protections", "It limits app choices", "It makes the battery last longer"], c: 1 },
                { q: "What is an 'Evil Twin' attack?", a: ["Hacking twins", "A malicious Wi-Fi hotspot pretending to be legitimate", "A spoofed phone number", "A cloned SIM card"], c: 1 },
                { q: "According to OWASP, what is a top risk for mobile apps?", a: ["Screen size", "Insecure data storage", "Battery consumption", "Slow loading"], c: 1 },
                { q: "How does a VPN help when using public Wi-Fi?", a: ["It makes the internet faster", "It creates an encrypted tunnel for your data", "It blocks ads", "It charges your phone"], c: 0 },
                { q: "What is 'Sideloading'?", a: ["Charging from the side", "Installing apps from unofficial/third-party sources", "Moving apps back and forth", "Deleting system apps"], c: 1 },
                { q: "An MDM solution allows an admin to:", a: ["Read your private texts", "Wipe corporate data remotely from a lost device", "Call you for free", "Change your wallpaper"], c: 1 },
                { q: "What is 'Bluejacking'?", a: ["Hacking a blue car", "Sending unsolicited messages via Bluetooth", "Stealing music", "A screen error"], c: 1 },
                { q: "Which factor is more secure for locking a phone?", a: ["No lock", "Simple swipe pattern", "Biometrics with a strong passcode", "4-digit PIN '0000'"], c: 2 },
                { q: "What is an 'IMSI Catcher'?", a: ["A device that mimics a cell tower", "A type of mobile app", "A screen protector", "A high-speed charger"], c: 0 }
            ])
        },
        {
            title: 'Malware & Ransomware',
            description: 'Technical deep-dive into malicious code, propagation, and disaster recovery.',
            type: 'VIDEO',
            riskReduction: 10,
            videoUrl: 'https://www.youtube.com/embed/n8mbzU0X2nQ', // Simplilearn: What Is Malware?
            theory: `# Malware & Ransomware: The Digital Pandemic

## 1. Classifying Malicious Software
Malware is an umbrella term for software designed to infiltrate or damage a computer system.
-   **Viruses**: Attached to legitimate programs; require human action to spread.
-   **Worms**: Self-replicating; spread across networks without human intervention.
-   **Trojans**: Disguised as useful software to gain access.
-   **Rootkits**: Designed to hide at the kernel level, making them invisible to standard scan tools.

## 2. The Ransomware Revolution
Ransomware has become a professionalized "Criminal Enterprise" (Ransomware-as-a-Service, or RaaS). 
### A. Encryption and Double Extortion
Modern attacks don't just encrypt files; they perform "Exfiltration" first. If the victim refuses to pay for the decryption key, the attackers threaten to leak sensitive data publicly. This is known as **Double Extortion**.

## 3. Advanced Persistence and Evasion
Attackers use several advanced techniques:
-   **Polymorphic Code**: The malware changes its signature with every infection to bypass signature-based antivirus.
-   **Fileless Malware**: Resides entirely in memory (RAM), using legitimate system tools like PowerShell to execute attacks, leaving no trace on the hard drive.
-   **Zero-Day Exploits**: Targeting vulnerabilities for which no patch or detection exists.

## 4. Detection and Response
Modern defense relies on **Endpoint Detection and Response (EDR)**. Unlike traditional antivirus, EDR uses behavioral analysis to detect "Living off the Land" techniques—actions that look normal but are part of an attack chain.

## 5. Recovery: The 3-2-1 Backup Strategy
The **CISA** and **SANS** recommend the 3-2-1 rule:
-   **3** copies of your data.
-   **2** different media types (e.g., Cloud and Local).
-   **1** copy completely **Offline/Air-gapped**.

## 6. Case Study: The WannaCry Outbreak (2017)
WannaCry was a global ransomware attack that affected over 200,000 computers in 150 countries. It utilized the "EternalBlue" exploit, which was a vulnerability in Microsoft's implementation of the Server Message Block (SMB) protocol. What made WannaCry unique was its "Worm" capability—once one computer on a network was infected, it automatically scanned for and infected other unpatched computers on the same network. It caused massive disruptions to the UK's National Health Service (NHS), forcing hospitals to turn away patients.

## 7. Technical Deep Dive: Signature-based vs. Heuristic Detection
Traditional antivirus relies on **Signatures**—digital fingerprints of known malware. If the file matches the fingerprint, it's blocked. However, as attackers use **Polymorphic** and **Metamorphic** code to change their fingerprints, this method fails. Modern EDR (Endpoint Detection and Response) uses **Heuristics** and **Behavioral AI**. Instead of looking at what the file *is*, it looks at what the file *does*. If a file starts rapidly encrypting the user's document folder, the EDR identifies this behavior as "Ransomware-like" and kills the process immediately, even if it has never seen that specific malware before.

## 8. The 'Kill Chain' of a Ransomware Attack
Understanding the Lockheed Martin "Cyber Kill Chain" is vital for defense:
1.  **Reconnaissance**: Finding the "weakest link" in the organization.
2.  **Weaponization**: Coupling an exploit with a backdoor.
3.  **Delivery**: Sending the weapon via email or a compromised website.
4.  **Exploitation**: Triggering the code.
5.  **Installation**: Gaining persistence (staying in the system after a reboot).
6.  **Command & Control**: The malware "calls home" for instructions.
7.  **Actions on Objectives**: Encrypting files and demanding ransom.

### References:
-   *NIST SP 800-83: Guide to Malware Incident Prevention and Handling.*
-   *Verizon Data Breach Investigations Report (DBIR).*
-   *Microsoft Digital Defense Reports.*
-   *Lockheed Martin: The Cyber Kill Chain Framework.*
-   *FireEye: Ransomware Protection and Containment Strategies.*
-   *Cybersecurity & Infrastructure Security Agency (CISA): Ransomware Guide.*`,
            quizData: JSON.stringify([
                { q: "What is 'Double Extortion' in ransomware?", a: ["Paying twice", "Encrypting files and threatening to leak stolen data", "Hacking two people at once", "Asking for double the money"], c: 1 },
                { q: "How does 'Fileless Malware' avoid detection?", a: ["It's too small", "It resides in RAM and uses legitimate system tools", "It hides in secret folders", "It's encrypted"], c: 1 },
                { q: "A 'Worm' is more dangerous than a 'Virus' because:", a: ["It is larger", "It can spread automatically across networks", "It only attacks BIOS", "It is written in Python"], c: 1 },
                { q: "What is 'Polymorphic Malware'?", a: ["Malware that changes its code signature to avoid detection", "Malware from different creators", "Malware that attacks multiple OSs", "Artificial Intelligence malware"], c: 0 },
                { q: "According to the 3-2-1 rule, where should at least one backup reside?", a: ["Public cloud", "On your desktop", "Completely offline (Air-gapped)", "In the trash"], c: 2 },
                { q: "What is RaaS?", a: ["Rapid antivirus as a software", "Ransomware-as-a-Service", "Remote access as a system", "Routing as a service"], c: 1 },
                { q: "What level of the system do 'Rootkits' typically target?", a: ["User interface", "Kernel/Hardware level", "Word documents", "Calculators"], c: 1 },
                { q: "Behavioral analysis in EDR tools is used to detect:", a: ["Bad moods", "Anomalous actions that appear legitimate but are part of an attack", "Old software", "Large files"], c: 1 },
                { q: "What is 'Living off the Land'?", a: ["Camping", "Using native system tools (like PowerShell) for malicious purposes", "Stealing power", "Using old hardware"], c: 1 },
                { q: "A 'Trojan' requires what to infect a system?", a: ["A horse", "The user to execute it while thinking it's something else", "A direct network link", "Zero-day vulnerability"], c: 1 }
            ])
        },
        {
            title: 'Social Engineering',
            description: 'Psychological warfare: Pretexting, baiting, and the manipulation of trust.',
            type: 'VIDEO',
            riskReduction: 20,
            videoUrl: 'https://www.youtube.com/embed/lc7scxvKQOo', // Simplilearn: Social Engineeringg Explained
            theory: `# Social Engineering: The Art of Human Manipulation

## 1. Defining the Threat
Social engineering is the manipulation of human emotions and instincts to perform actions or divulge confidential information. It is often the first step in high-profile data breaches. Attackers exploit cognitive biases rather than software bugs.

## 2. The Influence Triggers (Cialdini's Principles)
Attackers use specific psychological "levers":
-   **Authority**: Posing as law enforcement or a senior executive. People are culturally conditioned to obey authority.
-   **Liking**: Attackers spend weeks building rapport (friendship) with victims before making a request.
-   **Consistency**: Getting a victim to agree to a small request, then escalating to larger ones.

## 3. Specific Attack Vectors
-   **Tailgating/Piggybacking**: Physically following an authorized person into a restricted area.
-   **Baiting**: Leaving a malicious USB drive (often labeled "2024 Salaries") in a parking lot.
-   **Pretexting**: Creating a fabricated scenario (e.g., "I'm from the bank's fraud department and we noticed suspicious activity").
-   **Quid Pro Quo**: Offering a service (like an "IT fix") in exchange for login details.

## 4. The Defensive Mindset: 'Think Before You Click'
Technology cannot protect you if you give away your password. The primary defense is a strong security culture based on **Verification**. If someone calling sounds like your boss, call them back on their verified number. If an email seems too good to be true, it likely is.

## 5. Case Study: The 2020 Twitter Hack
In 2020, a group of young hackers compromised dozens of high-profile Twitter accounts (including Barack Obama, Joe Biden, and Elon Musk) through a "Social Engineering" attack on Twitter's internal employees. They used a "Vishing" attack, calling employees while pretending to be IT support and directing them to a phishing page that mirrored Twitter's internal VPN login. This allowed the attackers to harvest credentials and gain access to internal administrative tools. This case proves that even tech-savvy employees at a major social media company are vulnerable to well-crafted pretexts.

## 6. Technical Analysis: The Psychology of Micro-Compliance
Social engineers often use a technique called "The foot-in-the-door." By getting a victim to agree to a very small, harmless request (e.g., "Could you just confirm if the internet is slow for you today?"), they build a psychological bridge of compliance. Once the victim has said "Yes" once, they are significantly more likely to say "Yes" to a subsequent, more invasive request (e.g., "Could you just enter your extension number so I can run a diagnostic?").

## 7. Reporting: The Final Line of Defense
In a high-security environment, the most important action an employee can take is to **Report** a suspicious encounter immediately. Attackers often "test" multiple employees in the same day. A single report from one vigilant employee can trigger an organization-wide alert, neutralizing the entire campaign before a single click occurs.

### References:
-   *The Art of Deception (Kevin Mitnick).*
-   *SANS Institute: Securing the Human Project.*
-   *Social-Engineer.org: The Social Engineering Framework.*
-   *Cialdini, R. (2021). Influence: New and Expanded.*
-   *Hadnagy, C. (2018). Social Engineering: The Science of Human Hacking.*
-   *FBI: Public Service Announcement on Vishing Threats.*`,
            quizData: JSON.stringify([
                { q: "What is the primary target of Social Engineering?", a: ["Network routers", "Human psychology and trust", "Linux servers", "Physical locks"], c: 1 },
                { q: "An attacker leaving an infected USB drive in a parking lot is performing:", a: ["Tailgating", "Baiting", "Pretexting", "Vishing"], c: 1 },
                { q: "Which principle describes people's tendency to obey someone perceived as a boss?", a: ["Liking", "Authority", "Social Proof", "Scarcity"], c: 1 },
                { q: "What is 'Tailgating'?", a: ["A type of car accident", "Physically following an authorized person into a secure area", "Phishing a HR department", "Remote access"], c: 1 },
                { q: "What does 'Quid Pro Quo' mean in social engineering?", a: ["Fast attack", "Offering a fake service in exchange for info", "Silent scanning", "Legal action"], c: 1 },
                { q: "Why is 'Pretexting' effective?", a: ["It uses colors", "It creates a believable but fake scenario to build trust", "It is very fast", "It uses code"], c: 1 },
                { q: "What should you do if an 'IT staff' calls and asks for your MFA code?", a: ["Give it immediately", "Never share it and report via official channels", "Ask for their name", "Give a fake one"], c: 1 },
                { q: "Social engineers exploit 'Cognitive Biases'. What are they?", a: ["Computer errors", "Systematic patterns of deviation from rational judgment", "Brain injuries", "Memory leaks"], c: 1 },
                { q: "Which trigger uses the fear of missing out on a reward?", a: ["Authority", "Greed / Scarcity", "Liking", "Consistency"], c: 1 },
                { q: "Who is famous for documenting social engineering techniques in 'The Art of Deception'?", a: ["Bill Gates", "Kevin Mitnick", "Steve Jobs", "Edward Snowden"], c: 1 }
            ])
        },
        {
            title: 'Safe Web Browsing',
            description: 'Advanced web security: HTTPS, certificates, scaredware, and drive-by downloads.',
            type: 'VIDEO',
            riskReduction: 10,
            videoUrl: 'https://www.youtube.com/embed/Zf5w_ZJeCoE', // Safe Browsing Cybersecurity Training
            theory: `# Safe Web Browsing: Navigating the Hazardous Web

## 1. The Encrypted Web: HTTPS and Beyond
**HTTPS (Hypertext Transfer Protocol Secure)** is the standard for encrypted web traffic. It uses **TLS (Transport Layer Security)** to ensure that data sent between your browser and the server cannot be intercepted by Man-in-the-Middle (MITM) attacks.
-   **The Padlock Fallacy**: A padlock only means the *connection* is secure. It does not verify the *intent* of the website. Over 50% of phishing sites now use HTTPS certificates.

## 2. Modern Web Threats
-   **Drive-By Downloads**: Malicious code that executes automatically when you visit a compromised legitimate site. It exploits browser vulnerabilities or unpatched plugins (Java, Flash).
-   **Scareware**: Pop-ups that claim your computer is infected and offer a "scanner" which is actually a virus.
-   **Malvertising**: Legitimate advertising networks are sometimes used to spread malware via ads.

## 3. Browser Hardening
Users should:
-   **Enable Automatic Updates**: Browsers release 'Zero-Day' patches frequently.
-   **Manage Extensions**: Extensions have high-level permissions; only use trusted ones.
-   **Check the URL**: Manually inspect the domain for typos (e.g., \`paypa1.com\`).

## 4. Case Study: The 2011 Diginotat Breach
DigiNotar was a Dutch Certificate Authority (CA) that was breached by an attacker who managed to issue over 500 fraudulent SSL certificates, including one for \`google.com\`. This allowed the attacker (allegedly state-sponsored) to perform Man-in-the-Middle attacks on thousands of users in Iran, intercepting their private communications. The breach was so severe that DigiNotar eventually went bankrupt. This highlights the critical importance of the "Trust Chain" in web browsing and why browsers now have "Certificate Pinning" and "Certificate Transparency" logs.

## 5. Technical Deep Dive: Browser Exploits and Zero-Days
A browser is a massive piece of software with millions of lines of code. Attackers look for "Use-After-Free" or "Buffer Overflow" vulnerabilities. When a user visits a malicious site, the site sends specially crafted code that crashes the browser's process and "escapes" into the host operating system. This is why browsers now use a **Multi-Process Architecture**, where each tab is its own isolated sandbox. Even if one tab is compromised, the rest of the system remains (theoretically) protected.

## 6. Proactive Defense: DNS-Level Security
One of the most effective ways to browse safely is to use a secure DNS provider (like Cloudflare 1.1.1.1 or Cisco OpenDNS). These services maintain a real-time list of known phishing and malware domains. When your browser tries to connect to a dangerous site, the DNS server refuses to resolve the IP address, blocking the threat before a single byte of malicious code reaches your machine.

### References:
-   *Google Transparency Report on HTTPS.*
-   *NIST Guide to TLS Implementation.*
-   *OWASP Web Security Testing Guide.*
-   *Cloudflare: Learning Center - What is DNS Spoofing?*
-   *Mozilla: Security/Security Reviews/Certificate Transparency.*
-   *Chrome Security Blog: An Overview of the Browser Sandbox.*`,
            quizData: JSON.stringify([
                { q: "What does HTTPS primarily protect against?", a: ["Physical theft", "Man-in-the-Middle (MITM) interception", "Spam", "Hard drive failure"], c: 1 },
                { q: "Does a padlock icon guarantee a website is safe and legitimate?", a: ["Yes, always", "No, it only means the communication is encrypted", "Only on mobile", "Only if it is green"], c: 1 },
                { q: "What defines a 'Drive-by Download'?", a: ["A fast download", "Malware that installs automatically without user clicking", "Sending files via Bluetooth", "Ordering software from a car"], c: 1 },
                { q: "What is 'Scareware'?", a: ["Scary movies", "Fake alerts claiming infection to trick you into downloading malware", "Hardware crashes", "Ghosting people"], c: 1 },
                { q: "Which protocol replaced SSL for modern encrypted web traffic?", a: ["TCP", "TLS", "HTTP", "UDP"], c: 1 },
                { q: "What is 'Malvertising'?", a: ["BAD ads", "Distributing malware through legitimate advertising networks", "Mailing viruses", "TV ads"], c: 1 },
                { q: "Why are browser extensions a security risk?", a: ["They take up too much space", "They have high-level permissions to read your data", "They change the background", "They make the browser slow"], c: 1 },
                { q: "What should you check in the browser bar to detect 'Typosquatting'?", a: ["The color", "The exact spelling of the domain unit", "The height of the bar", "The date"], c: 1 },
                { q: "How should you respond to a browser 'Insecure Site' warning?", a: ["Ignore and click 'Advanced' to enter", "Heed the warning and leave the site", "Restart the computer", "Buy a new router"], c: 1 },
                { q: "What does 'Sandboxing' in a modern browser do?", a: ["Stores cookies in sand", "Isolates web pages from the rest of the system", "Syncs bookmarks", "Checks spelling"], c: 1 }
            ])
        },
        {
            title: 'Data Protection',
            description: 'Regulatory compliance, encryption, and handling of sensitive information (PII/PHI).',
            type: 'VIDEO',
            riskReduction: 10,
            videoUrl: 'https://www.youtube.com/embed/ygYi-lOidJM', // GDPR Training Introduction
            theory: `# Data Protection: Privacy and Security in the Digital Era

## 1. Defining Sensitive Data
Data protection focuses on the confidentiality, integrity, and availability (the **CIA Triad**) of information.
-   **PII (Personally Identifiable Information)**: Name, Social Security Number, Biometric records.
-   **PHI (Protected Health Information)**: Medical history, insurance details.

## 2. Regulatory Landscapes (GDPR, CCPA)
The **GDPR (General Data Protection Regulation)** in Europe has set a global standard. It mandates:
-   **Privacy by Design**: Security must be built-in from the start.
-   **Right to Access**: Users can see what data is held about them.
-   **72-Hour Breach Notification**: Companies must report breaches quickly.

## 3. Data States and Encryption
-   **Data at Rest**: Stored on disks; protected by Full Disk Encryption (FDE).
-   **Data in Transit**: Being sent over networks; protected by TLS/SSL.
-   **Data in Use**: Currently being processed in RAM; the most vulnerable state.

## 4. Operational Best Practices
-   **Data Minimization**: Only collect the data you absolutely need.
-   **Secure Disposal**: Use cross-cut shredders for physical documents and secure wiping tools for digital media.
-   **Access Control**: Principles of **Least Privilege** (giving users only the access they need to do their jobs).

## 5. Case Study: The 2017 Equifax Data Breach
Equifax, one of the largest credit reporting agencies, suffered a massive breach that exposed the personal data of 147 million people. The breach occurred because Equifax failed to patch a known vulnerability in the Apache Struts web framework. The attackers remained in the system for over two months, exfiltrating data because it wasn't properly encrypted at rest inside the internal databases. This case cost the company over $1.4 billion in settlements and remains a textbook example of the catastrophic consequences of poor "Data Lifecycle Management."

## 6. Technical Deep Dive: Homomorphic Encryption
The Holy Grail of data protection is **Homomorphic Encryption**. Traditional encryption requires you to decrypt data before it can be processed or analyzed. Homomorphic encryption allows mathematical operations to be performed on the *encrypted* data itself, producing an encrypted result that, when decrypted, matches the output of operations performed on the plaintext. This allows for total data privacy even when using third-party cloud analytics services.

## 7. Data Sovereignty and the Cloud
With the rise of the cloud, "where" your data is stored matters legally. GDPR requires that data about EU citizens remain within the EU or in jurisdictions with equivalent protection. Organizations must now use **Data Residency** controls to ensure their cloud providers (AWS, Azure, GCP) don't move sensitive data across borders without proper legal frameworks (like the Data Privacy Framework).

### References:
-   *Official GDPR Text (gdpr-info.eu).*
-   *ISO/IEC 27001 (Information Security Management).*
-   *NIST SP 800-88: Guidelines for Media Sanitization.*
-   *Equifax Data Breach Settlement (FTC.gov).*
-   *Microsoft: Data Residency and Sovereignty in the Cloud.*
-   *International Association of Privacy Professionals (IAPP): Resource Center.*`,
            quizData: JSON.stringify([
                { q: "What are the three pillars of the CIA Triad?", a: ["Central, Integrated, Active", "Confidentiality, Integrity, Availability", "Code, Input, Analysis", "Control, Identity, Access"], c: 1 },
                { q: "What is considered PII?", a: ["Weather reports", "Social Security Numbers and Biometric records", "Movie reviews", "Network speed"], c: 1 },
                { q: "Under GDPR, within how many hours must a data breach be reported?", a: ["24 hours", "48 hours", "72 hours", "1 week"], c: 2 },
                { q: "What does 'Data in Use' refer to?", a: ["Data on a CD", "Data currently being processed in the system's memory (RAM)", "Data sent over email", "Deleted data"], c: 1 },
                { q: "What is 'Data Minimization'?", a: ["Compressing files", "Only collecting the minimum necessary data for a task", "Deleting old files", "Using small fonts"], c: 1 },
                { q: "Which tool is best for destroying sensitive physical documents?", a: ["Trash can", "Recycle bin", "Cross-cut shredder", "Folder"], c: 2 },
                { q: "The principle of 'Least Privilege' means:", a: ["Everyone gets admin access", "Users only get access to what they need for their job", "Lowering salaries", "Giving more time off"], c: 1 },
                { q: "What is 'PHI'?", a: ["Public Home Insurance", "Protected Health Information", "Private Hardware Index", "Personal Home ID"], c: 1 },
                { q: "What does Full Disk Encryption (FDE) primarily protect?", a: ["Data in Transit", "Data at Rest", "Data in Use", "Internet speed"], c: 1 },
                { q: "The 'Right to Access' allows citizens to:", a: ["Enter data centers", "See the personal data a company has collected about them", "Change their name", "Access free Wi-Fi"], c: 1 }
            ])
        },
        {
            title: 'Physical Security',
            description: 'The physical layer: Facility protection, device control, and counter-tailgating.',
            type: 'VIDEO',
            riskReduction: 5,
            videoUrl: 'https://www.youtube.com/embed/APY0W8Mdh0k', // Physical Security Awareness (1:18)
            theory: `# Physical Security: Protecting the Foundation

## 1. Why Physics Matters in Cyber
The best encryption is useless if an attacker can walk into a server room and plug in a device. Physical security is the first line of defense in a **Defense-in-Depth** strategy.

## 2. Common Physical Threats
-   **Tailgating (Piggybacking)**: An unauthorized person follows an authorized person through a secure door.
-   **Shoulder Surfing**: Watching someone type their credentials or PIN.
-   **Dumpster Diving**: Searching through trash to find sensitive documents, old hard drives, or employee directories.
-   **Social Engineering at the Front Desk**: Posing as a delivery driver or maintenance worker to gain entry.

## 3. Physical Controls and Policies
-   **Administrative Controls**: Visitor logs, "Clean Desk" policies, and employee badges.
-   **Physical Barriers**: Bollards, mantraps (double-door entries), and turnstiles.
-   **Technical Controls**: CCTV, biometric access readers, and motion sensors.

## 4. Hardware Hygiene
-   **Locking Workstations**: Use \`Win + L\` (Windows) or \`Cmd + Ctrl + Q\` (Mac) every time you leave your desk.
-   **USB Security**: Never plug in an unknown USB device. This is a primary vector for air-gapped network infections (e.g., Stuxnet).

## 5. Case Study: The 2011 RSA SecurID Breach
In 2011, attackers targeted RSA, the leading provider of MFA tokens. The attack began with a social engineering email but lead to a physical-level breach of trust. By obtaining the "Seed" values for millions of hardware tokens, the attackers were able to clone the physical tokens used by high-value government and defense contractors. This forced RSA to replace 40 million tokens worldwide. It demonstrates that the security of a digital system is inextricably linked to the physical security of the tokens and the facilities where they are manufactured.

## 6. Technical Deep Dive: PIV and CAC Cards
The US Department of Defense uses **CAC (Common Access Card)** and **PIV (Personal Identity Verification)** cards. These are physical "Smart Cards" that contain a cryptographic chip. Unlike a standard badge, these require a "Knowledge Factor" (PIN) to activate the chip. This provides "True Two-Factor Authentication" at the physical door: you must have the physical card (Possession) and know the PIN (Knowledge).

## 7. The Human Factor: 'Tailgating Awareness'
The most common physical security failure is **Politeness**. Employees often feel awkward closing a door in the face of someone following behind them, especially if they are carrying coffee or a package. Security training must emphasize that "Correcting Politeness" is a security requirement. Employees should be taught to say, "I'm sorry, company policy requires everyone to badge in individually. I'll hold the door while you tap your card."

### References:
-   *NIST SP 800-116: A Guide to the Use of PIV Credentials in Physical Access Control Systems.*
-   *CPTED (Crime Prevention Through Environmental Design) Principles.*
-   *RSA Security: The Anatomy of an Advanced Persistent Threat.*
-   *ASIS International: Physical Security Professional (PSP) Study Guide.*
-   *CISA: Physical Security of Information Technology Resources.*`,
            quizData: JSON.stringify([
                { q: "What is a 'Mantrap' in physical security?", a: ["A hunter's tool", "A double-door system where the first door must close before the second opens", "A type of firewall", "A secure computer case"], c: 1 },
                { q: "Why is 'Tailgating' a major concern?", a: ["It causes traffic", "It allows unauthorized people to enter secure areas without a badge", "It's a type of phishing", "It uses too much bandwidth"], c: 1 },
                { q: "Which control is considered 'Administrative'?", a: ["CCTV cameras", "Visitor logs and Clean Desk policies", "Steel doors", "Motion sensors"], c: 1 },
                { q: "What is 'Shoulder Surfing'?", a: ["Surfing on a person", "Watching someone enter passwords or PINs over their shoulder", "A back massage", "Cleaning a keyboard"], c: 1 },
                { q: "What should you do with an unknown USB drive found in the lobby?", a: ["Plug it in to find the owner", "Use it as a backup drive", "Deliver to Security/IT without plugging it in", "Throw it in the river"], c: 2 },
                { q: "A 'Bollard' is used for:", a: ["Network security", "Preventing vehicles from crashing into a building", "Storing passwords", "Lighting the parking lot"], c: 1 },
                { q: "What is 'Dumpster Diving'?", a: ["Searching trash for sensitive info", "Diving into a pool", "Repairing old computers", "Cleaning the office"], c: 0 },
                { q: "What is the primary goal of a 'Clean Desk' policy?", a: ["To be neat", "To prevent sensitive data or passwords from being exposed to passersby", "To save space", "To please the janitor"], c: 1 },
                { q: "Which keyboard shortcut locks an unattended Windows session?", a: ["Ctrl + L", "Win + L", "Alt + L", "Shift + L"], c: 1 },
                { q: "What does 'Defense-in-Depth' mean?", a: ["Having one very strong firewall", "Using multiple layers of different security controls", "Building a bunker", "Having many passwords"], c: 1 }
            ])
        }
    ];
    for (const module of modules) {
        // Upsert module to avoid duplicates
        const ex = await prisma.module.findFirst({ where: { title: module.title } });
        if (ex) {
            await prisma.module.update({ where: { id: ex.id }, data: module });
        }
        else {
            await prisma.module.create({ data: module });
        }
        console.log(`CREATED MODULE: ${module.title}`);
    }
    // 4. Simulations Data (Inbox Drill)
    const simulations = [
        // --- PHISHING EMAILS ---
        {
            title: 'Urgent Reset',
            description: 'Simulated phishing attempt using typo-squatting and urgency.',
            difficulty: 'EASY',
            sender: 'security@g0ogle-alerts.com',
            subject: 'Critical Security Alert: Suspicious Login Detected',
            content: `<p>We detected a login attempt from an unrecognized device in <strong>Moscow, Russia</strong>.</p><p>If this wasn't you, please <a href="#" style="color: blue; text-decoration: underline;">reset your password immediately</a> to secure your account.</p><p>Failure to act within 24 hours will result in account suspension.</p>`,
            isPhishing: true,
            explanation: 'The sender domain is "g0ogle-alerts.com" (typosquatting). The sense of urgency ("within 24 hours") is a common social engineering tactic.'
        },
        {
            title: 'Bank Verification',
            description: 'Simulated phishing attempt using fake KYC requirements and HTML attachments.',
            difficulty: 'MEDIUM',
            sender: 'alert@chase-secure-banking.net',
            subject: 'Action Required: Verify your identity',
            content: `<p>Dear Valued Customer,</p><p>Due to recent regulatory changes, we need to update our KYC (Know Your Customer) records. Please open the attached secure document to review your profile.</p><br/><div style="border: 1px solid #ccc; padding: 10px; background: #f9f9f9;">📄 Secure_Document_7422.html (14KB)</div>`,
            isPhishing: true,
            explanation: 'Banks never ask you to download HTML attachments for verification. The domain "chase-secure-banking.net" is not the official Chase domain.'
        },
        {
            title: 'University Grades',
            description: 'Simulated phishing attempt targeting students with fake portals.',
            difficulty: 'MEDIUM',
            sender: 'registrar@university-grades-portal.info',
            subject: 'Final Grades: Spring Semester 2024',
            content: `<p>Hello Student,</p><p>Your final grades for the Spring 2024 semester have been published.</p><p>Click <a href="#">Student Portal Login</a> to view your transcript.</p><p>Best,<br>Office of the Registrar</p>`,
            isPhishing: true,
            explanation: 'Check the URL. The sender domain uses ".info" and a hyphenated name, which is highly suspicious for an official university registrar.'
        },
        {
            title: 'CEO Gift Card',
            description: 'Simulated CEO Fraud/BEC attack asking for financial favors.',
            difficulty: 'EASY',
            sender: 'ceo.impersonator99@gmail.com',
            subject: 'Urgent Request',
            content: `<p>Hi,</p><p>I am in a meeting and can't talk right now. I need you to do me a favor. Can you purchase 5x $100 Apple Gift Cards for a client gift? I will reimburse you immediately.</p><p>Send me the codes ASAP.</p><p>Sent from my iPhone</p>`,
            isPhishing: true,
            explanation: 'Classic "CEO Fraud". The sender address is a personal Gmail account, not the corporate address. The request involves purchasing gift cards, which is a red flag.'
        },
        {
            title: 'Package Delivery',
            description: 'Simulated Smishing/Phishing regarding fake package deliveries.',
            difficulty: 'EASY',
            sender: 'tracking@fedex-support-team.com',
            subject: 'Delivery Exception: Unable to deliver package',
            content: `<p>We attempted to deliver your package #899212 but no one was home.</p><p>Please <a href="#">click here to reschedule delivery</a>. A small fee of $1.99 applies for redelivery.</p>`,
            isPhishing: true,
            explanation: 'Delivery services usually leave a physical tag or email from their official domain (fedex.com). The request for a small fee is a tactic to steal credit card info.'
        },
        {
            title: 'HR Policy Update',
            description: 'Simulated Spear Phishing using corporate internal policy lures.',
            difficulty: 'HARD',
            sender: 'hr-people-ops@internal-corporate.net',
            subject: 'Mandatory: New Remote Work Policy',
            content: `<p>Team,</p><p>Please review the updated 2024 Remote Work Policy attached. You must sign the acknowledgment form by Friday.</p><p><a href="#">Click here to sign via DocuSign</a></p><p>Thanks,<br>Human Resources</p>`,
            isPhishing: true,
            explanation: 'This is a targeted "Spear Phishing" test. While it looks professional, the domain "internal-corporate.net" is likely external. Always verify policy changes via known internal portals.'
        },
        {
            title: 'IT Helpdesk Password Expiry',
            description: 'Simulated credential harvesting attack pretending to be IT support.',
            difficulty: 'MEDIUM',
            sender: 'admin@it-support-desk.org',
            subject: 'Password Expiration Notice',
            content: `<p>Your network password will expire in 3 days.</p><p>To keep your current password, log in to the <a href="#">Password Manager Portal</a> and select "Extend Expiration".</p>`,
            isPhishing: true,
            explanation: 'IT support will never ask you to click a link to "keep" a password. This is a credential harvesting page.'
        },
        {
            title: 'Social Media Tag',
            description: 'Simulated notification spam with homograph link attacks.',
            difficulty: 'MEDIUM',
            sender: 'notifications@facebo0k-photos.com',
            subject: 'You were tagged in a photo',
            content: `<p>Jessica S. tagged you in a photo album "Office Party 2024".</p><p><a href="#">View Photo</a></p>`,
            isPhishing: true,
            explanation: '"facebo0k-photos.com" uses a zero instead of an "o". This is a homograph attack.'
        },
        {
            title: 'Invoice Payment',
            description: 'Simulated BEC attack involving invoice fraud.',
            difficulty: 'HARD',
            sender: 'accounting@vendor-partner-payments.com',
            subject: 'Overdue Invoice #9921',
            content: `<p>Attached is the overdue invoice for last month's services. Please remit payment to the <strong>new bank account</strong> details listed in the PDF.</p>`,
            isPhishing: true,
            explanation: 'Requests to change bank account details for payments are a hallmark of Business Email Compromise (BEC). Verify via phone call.'
        },
        {
            title: 'Cloud Storage Full',
            description: 'Simulated urgency attack regarding data loss.',
            difficulty: 'EASY',
            sender: 'storage@dropb0x-cloud.com',
            subject: 'Your storage is full',
            content: `<p>Your Dropbox is full. You will lose recent files if you don't upgrade now.</p><p><a href="#">Upgrade to Pro (Free for 30 days)</a></p>`,
            isPhishing: true,
            explanation: 'Sender domain "dropb0x" is spoofed. Fear of data loss is used to trigger a quick click.'
        },
        // --- SAFE EMAILS ---
        {
            title: 'Legitimate Newsletter',
            description: 'Standard safe newsletter for control.',
            difficulty: 'EASY',
            sender: 'newsletter@securityweekly.com',
            subject: 'This Week in Cyber: Ransomware trends',
            content: `<p>Hi Subscriber,</p><p>Here is your weekly roundup of security news.</p><ul><li>New zero-day in Chrome...</li><li>FBI releases report...</li></ul><p><a href="https://securityweekly.com/issue-244">Read full issue</a></p><p>Unsubscribe | Manage Preferences</p>`,
            isPhishing: false,
            explanation: 'This is a standard newsletter from a known, legitimate domain. The link points to the same domain.'
        },
        {
            title: 'Internal Meeting',
            description: 'Standard safe internal meeting invite.',
            difficulty: 'EASY',
            sender: 'jane.doe@cyber.edu',
            subject: 'Project Kickoff Meeting',
            content: `<p>Hi Team,</p><p>Scheduling the kickoff for next Tuesday at 2 PM. Invite attached.</p><p>Thanks,<br>Jane</p>`,
            isPhishing: false,
            explanation: 'Internal email from a colleague (@cyber.edu) with a standard calendar invite. No urgency, no links asking for credentials.'
        },
        {
            title: 'Software Update Notification',
            description: 'Safe software update notification from a trusted vendor.',
            difficulty: 'MEDIUM',
            sender: 'support@zoom.us',
            subject: 'Zoom Update Available: Version 5.14.0',
            content: `<p>A new version of Zoom is available. This update includes stability improvements.</p><p>Your client will update automatically upon next launch, or you can download it from <a href="https://zoom.us/download">zoom.us/download</a>.</p>`,
            isPhishing: false,
            explanation: 'The email comes from the official "zoom.us" domain and directs users to the official download page (or automatic update), which is safe behavior.'
        },
        {
            title: 'Bank Statement',
            description: 'Safe bank notification instructing user to login manually.',
            difficulty: 'MEDIUM',
            sender: 'statements@chase.com',
            subject: 'Your Monthly Statement is Ready',
            content: `<p>Your statement for the period ending Jan 31 is now available.</p><p>Please log in to your account at Chase.com to view your documents.</p><p>Note: We will never ask for your PIN via email.</p>`,
            isPhishing: false,
            explanation: 'Legitimate banking emails tell you to go to the website yourself ("log in at Chase.com") rather than providing a direct "Click here to login" link.'
        },
        {
            title: 'Order Confirmation',
            description: 'Safe order confirmation from a retailer.',
            difficulty: 'MEDIUM',
            sender: 'orders@amazon.com',
            subject: 'Your Amazon.com order of "Logitech Mouse"',
            content: `<p>Thanks for your order.</p><p>Arriving: Thursday</p><p>Track your package on Amazon.com</p>`,
            isPhishing: false,
            explanation: 'Standard transactional email from the official domain. No suspicious urgency or requests for personal info.'
        },
        {
            title: 'University Announcement',
            description: 'Safe informational broadcast.',
            difficulty: 'EASY',
            sender: 'president@cyber.edu',
            subject: 'Campus Closure due to Weather',
            content: `<p>Dear Students and Faculty,</p><p>Due to the approaching storm, campus will be closed tomorrow. detailed updates will be posted on the university homepage.</p>`,
            isPhishing: false,
            explanation: 'Official communication from internal domain. Informational only, no call to action.'
        },
        {
            title: 'LinkedIn Connection',
            description: 'Safe social media notification.',
            difficulty: 'HARD',
            sender: 'messages-noreply@linkedin.com',
            subject: 'Alice sent you a connection request',
            content: `<p><strong>Alice Smith</strong> wants to connect.</p><p>Software Engineer at Tech Corp.</p><p><a href="https://www.linkedin.com/comm/mynetwork/discovery-see-all">View Profile</a></p>`,
            isPhishing: false,
            explanation: 'This is a genuine LinkedIn notification. The sender is the official sub-domain and the link points to linkedin.com.'
        },
        {
            title: 'GitHub 2FA',
            description: 'Safe 2FA code delivery.',
            difficulty: 'MEDIUM',
            sender: 'noreply@github.com',
            subject: 'Your authentication code',
            content: `<p>Here is your one-time authentication code: <strong>882910</strong></p><p>Reference ID: GH-7721</p>`,
            isPhishing: false,
            explanation: 'Standard 2FA delivery email. Short, concise, expected (if user triggered it), and from official domain.'
        },
        {
            title: 'Google Calendar',
            description: 'Safe calendar reminder.',
            difficulty: 'EASY',
            sender: 'calendar-notification@google.com',
            subject: 'Reminder: Doctor Appointment @ 10am',
            content: `<p>You have an event in 10 minutes.</p>`,
            isPhishing: false,
            explanation: 'Legitimate automated notification from Google Calendar.'
        },
        {
            title: 'Marketing Promo',
            description: 'Safe marketing email that looks spammy but is legitimate.',
            difficulty: 'HARD',
            sender: 'promo@nike.com',
            subject: 'Flash Sale: 50% Off Everything',
            content: `<p>Don't miss out! The end of season sale starts now.</p><p><a href="https://www.nike.com/sale">Shop Now</a></p>`,
            isPhishing: false,
            explanation: 'Sometimes marketing looks like spam, but this is a legitimate promotional email from the official "nike.com" domain.'
        }
    ];
    for (const sim of simulations) {
        await prisma.simulation.create({ data: sim });
        console.log(`CREATED SIMULATION: ${sim.title}`);
    }
    console.log(`SEEDING COMPLETE.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
