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
    `Current System Status:`,
    `• CPU Usage: ${systemInfo.cpu.usage}%${systemInfo.cpu.usage > 80 ? ' (HIGH!)' : ''}`,
    `• Memory Usage: ${systemInfo.memory.usage}%${systemInfo.memory.usage > 90 ? ' (CRITICAL!)' : ''}`,
    `• Disk Usage: ${systemInfo.diskSpace.usage}%${systemInfo.diskSpace.usage > 90 ? ' (CRITICAL!)' : ''}`
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
    const issues = [];
    if (systemInfo.cpu.usage > 80) {
      issues.push('• High CPU usage detected');
    }
    if (systemInfo.memory.usage > 90) {
      issues.push('• Low memory available');
    }
    if (systemInfo.cpu.temperature && systemInfo.cpu.temperature > 80) {
      issues.push('• High temperature detected');
    }
    
    return `${systemStatus}

Detected issues:
${issues.join('\n')}

Solutions (most effective first):

1. Close any programs you're not using right now
   - Open Task Manager
   - Look for programs using lots of resources
   - Close ones you don't need

2. Restart your computer
   - Save your work
   - Click Start menu
   - Choose Restart

3. Run a quick virus scan
   - Open Windows Security
   - Choose Quick Scan
   - Wait for results

4. Update your drivers
   - Open Device Manager
   - Look for yellow warning symbols
   - Update those devices`;
  }

  // Network Issues
  if (problems.network.some(term => input.includes(term))) {
    return `${systemStatus}

Solutions (in order of effectiveness):

1. Restart your router
   - Unplug your router
   - Wait 30 seconds
   - Plug it back in

2. Try a wired connection
   - Connect computer directly to router with cable
   - Test internet speed

3. Run Network Troubleshooter
   - Open Settings
   - Choose Network & Internet
   - Run troubleshooter

4. Check for Windows updates
   - Open Settings
   - Choose Windows Update
   - Check for updates`;
  }

  // Blue Screen Issues
  if (problems.blueScreen.some(term => input.includes(term))) {
    return `${systemStatus}

Solutions (most likely to help first):

1. Restart your computer
   - Save any open work
   - Click Start menu
   - Choose Restart

2. Update your drivers
   - Open Device Manager
   - Look for yellow warning symbols
   - Right-click and update drivers

3. Run Windows Memory Diagnostic
   - Type 'memory' in Start menu
   - Choose Windows Memory Diagnostic
   - Follow the prompts

4. Check for error codes
   - Write down any error codes you see
   - Take a photo of blue screen if possible`;
  }

  // Storage Issues
  if (problems.storage.some(term => input.includes(term))) {
    return `${systemStatus}

Solutions (quickest first):

1. Empty your Recycle Bin
   - Right-click Recycle Bin
   - Choose Empty Recycle Bin
   - Confirm deletion

2. Delete unnecessary downloads
   - Open Downloads folder
   - Sort by size
   - Delete large files you don't need

3. Uninstall unused programs
   - Open Settings
   - Go to Apps
   - Remove programs you don't use

4. Move large files
   - Find large files using Storage Sense
   - Copy to external drive
   - Delete from computer`;
  }

  // Audio Issues
  if (problems.audio.some(term => input.includes(term))) {
    return `${systemStatus}

Solutions (easiest first):

1. Check physical connections
   - Make sure speakers/headphones are plugged in
   - Try different USB ports if needed
   - Check cable connections

2. Check Windows sound settings
   - Click speaker icon in taskbar
   - Make sure not muted
   - Try increasing volume

3. Restart your computer
   - Save all work
   - Click Start menu
   - Choose Restart

4. Update audio drivers
   - Open Device Manager
   - Find Sound devices
   - Update drivers`;
  }

  // If no specific condition is met
  return `${systemStatus}

To help you better, please tell me:

1. What exactly isn't working?
   - What happens when you try?
   - Any error messages?

2. When did it start?
   - Was it working before?
   - What changed?

3. Recent system changes?
   - New programs installed?
   - Recent updates?

4. What have you tried so far?`;
}