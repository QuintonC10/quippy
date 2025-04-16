import { GoogleGenerativeAI } from '@google/generative-ai';

interface SystemInfo {
  os: string;
  cpu: {
    usage: number;
    temperature?: number;
  };
  memory: {
    total: number;
    free: number;
    usage: number;
  };
  diskSpace: {
    total: number;
    free: number;
    usage: number;
  };
}

export async function scanSystem(): Promise<SystemInfo> {
  const response = await fetch('/api/system');
  if (!response.ok) {
    throw new Error('Failed to scan system information');
  }
  return response.json();
}

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export async function analyzeProblem(userInput: string, systemInfo: SystemInfo) {
  try {
    const prompt = `You are a friendly computer helper. Given:

System Status:
- CPU Usage: ${systemInfo.cpu.usage}%
- Memory Usage: ${systemInfo.memory.usage}%
- Disk Space Used: ${systemInfo.diskSpace.usage}%

User Problem: "${userInput}"

Provide a simple response with:
1. What might be wrong (1-2 sentences)
2. Numbered solutions (1-4) ordered from most effective to least effective
3. Format each solution like this:

1. First solution
   - Step one
   - Step two
   - Step three

2. Second solution
   - Step one
   - Step two

etc.

Use simple language and keep the total response under 200 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();
    
    if (!analysis || analysis.length < 10) {
      return basicAnalysis(userInput, systemInfo);
    }
    
    return analysis;
  } catch (error) {
    console.error('Gemini API error:', error);
    return basicAnalysis(userInput, systemInfo);
  }
}

// Rename the existing analyzeProblem function to basicAnalysis
function basicAnalysis(userInput: string, systemInfo: SystemInfo) {
  const input = userInput.toLowerCase();
  
  const systemStatus = [
    `📊 SYSTEM STATUS`,
    `----------------------------------------`,
    `CPU Usage:    ${systemInfo.cpu.usage}%${systemInfo.cpu.usage > 80 ? ' ⚠️ HIGH' : ''}`,
    `Memory Usage: ${systemInfo.memory.usage}%${systemInfo.memory.usage > 90 ? ' ⚠️ CRITICAL' : ''}`,
    `Disk Usage:   ${systemInfo.diskSpace.usage}%${systemInfo.diskSpace.usage > 90 ? ' ⚠️ CRITICAL' : ''}`,
    `----------------------------------------`
  ].join('\n');

  const problems = {
    performance: ['slow', 'sluggish', 'freezing', 'crashing', 'not responding', 'performance'],
    startup: ['won\'t start', 'won\'t boot', 'black screen', 'blank screen', 'no display'],
    memory: ['ram', 'memory', 'not enough memory'],
    storage: ['disk', 'storage', 'drive', 'space', 'full'],
    temperature: ['hot', 'heat', 'overheating', 'fan', 'noise'],
    network: ['internet', 'wifi', 'network', 'connection', 'offline'],
    usb: ['usb', 'port', 'not recognized', 'not working'],
    audio: ['sound', 'audio', 'speaker', 'headphone', 'no sound'],
    printer: ['print', 'printer', 'scanning', 'copying'],
    blueScreen: ['blue screen', 'bsod', 'crash', 'error screen'],
    software: ['install', 'uninstall', 'program', 'application', 'software'],
    battery: ['battery', 'power', 'charging', 'draining'],
    keyboard: ['keyboard', 'keys', 'typing'],
    mouse: ['mouse', 'cursor', 'clicking'],
    touchpad: ['touchpad', 'trackpad'],
    updates: ['update', 'windows update', 'upgrade'],
    popups: ['pop-up', 'popup', 'ads', 'advertising'],
    externalDevices: ['external', 'device', 'peripheral', 'not detected'],
    fileCorruption: ['file', 'corrupt', 'won\'t open'],
    applications: ['app', 'program', 'software', 'not responding']
  };

  // Performance Issues
  if (problems.performance.some(term => input.includes(term))) {
    const issues: string[] = [];
    if (systemInfo.cpu.usage > 80) {
      issues.push('⚠️ High CPU usage detected');
    }
    if (systemInfo.memory.usage > 90) {
      issues.push('⚠️ Low memory available');
    }
    if (systemInfo.cpu.temperature && systemInfo.cpu.temperature > 80) {
      issues.push('⚠️ High temperature detected');
    }
    
    return `${systemStatus}

🔍 DETECTED ISSUES:
${issues.join('\n')}

💡 RECOMMENDED SOLUTIONS:

1️⃣ Close Unused Programs
   • Open Task Manager
   • Look for programs using lots of resources
   • Close ones you don't need

2️⃣ Restart Your Computer
   • Save your work
   • Click Start menu
   • Choose Restart

3️⃣ Run Virus Scan
   • Open Windows Security
   • Choose Quick Scan
   • Wait for results

4️⃣ Update Drivers
   • Open Device Manager
   • Look for yellow warning symbols
   • Update those devices`;
  }

  // Network Issues
  if (problems.network.some(term => input.includes(term))) {
    return `${systemStatus}

💡 RECOMMENDED SOLUTIONS:

1️⃣ Restart Router
   • Unplug your router
   • Wait 30 seconds
   • Plug it back in

2️⃣ Try Wired Connection
   • Connect computer directly to router
   • Test internet speed

3️⃣ Run Network Troubleshooter
   • Open Settings
   • Choose Network & Internet
   • Run troubleshooter

4️⃣ Check Windows Updates
   • Open Settings
   • Choose Windows Update
   • Check for updates`;
  }

  // Blue Screen Issues
  if (problems.blueScreen.some(term => input.includes(term))) {
    return `${systemStatus}

💡 RECOMMENDED SOLUTIONS:

1️⃣ Restart Computer
   • Save any open work
   • Click Start menu
   • Choose Restart

2️⃣ Update Drivers
   • Open Device Manager
   • Look for yellow warnings
   • Update drivers

3️⃣ Run Memory Diagnostic
   • Type 'memory' in Start menu
   • Choose Windows Memory Diagnostic
   • Follow prompts

4️⃣ Document Error Codes
   • Write down error codes
   • Take photo of blue screen`;
  }

  // Storage Issues
  if (problems.storage.some(term => input.includes(term))) {
    return `${systemStatus}

💡 RECOMMENDED SOLUTIONS:

1️⃣ Empty Recycle Bin
   • Right-click Recycle Bin
   • Choose Empty Recycle Bin
   • Confirm deletion

2️⃣ Delete Downloads
   • Open Downloads folder
   • Sort by size
   • Delete large files

3️⃣ Uninstall Programs
   • Open Settings
   • Go to Apps
   • Remove unused programs

4️⃣ Move Large Files
   • Find large files
   • Copy to external drive
   • Delete from computer`;
  }

  // Audio Issues
  if (problems.audio.some(term => input.includes(term))) {
    return `${systemStatus}

💡 RECOMMENDED SOLUTIONS:

1️⃣ Check Connections
   • Verify speaker/headphone connections
   • Try different USB ports
   • Check cables

2️⃣ Check Sound Settings
   • Click speaker icon
   • Ensure not muted
   • Adjust volume

3️⃣ Restart Computer
   • Save all work
   • Click Start menu
   • Choose Restart

4️⃣ Update Audio Drivers
   • Open Device Manager
   • Find Sound devices
   • Update drivers`;
  }

  // If no specific condition is met
  return `${systemStatus}

❓ To help you better, please provide:

1️⃣ What exactly isn't working?
   • What happens when you try?
   • Any error messages?

2️⃣ When did it start?
   • Was it working before?
   • What changed?

3️⃣ Recent changes?
   • New programs installed?
   • Recent updates?

4️⃣ What have you tried?`;
}