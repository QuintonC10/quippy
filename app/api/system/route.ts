import { NextResponse } from 'next/server';
import si from 'systeminformation';

// Mark this route as server-side only
export const runtime = 'nodejs';
// If edge runtime doesn't work, try this instead:
// export const runtime = 'nodejs';

export async function GET() {
  try {
    // Get real system information
    const [osInfo, cpuData, memData, diskData, tempData] = await Promise.all([
      si.osInfo(),
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.cpuTemperature()
    ]);

    // Calculate memory usage percentage
    const memoryUsage = ((memData.total - memData.available) / memData.total) * 100;
    
    // Get first disk (usually main drive)
    const mainDisk = diskData[0];
    const diskUsage = ((mainDisk.size - mainDisk.available) / mainDisk.size) * 100;

    return NextResponse.json({
      os: `${osInfo.distro} ${osInfo.release}`,
      cpu: {
        usage: Math.round(cpuData.currentLoad),
        temperature: tempData.main || undefined
      },
      memory: {
        total: Math.round(memData.total / (1024 * 1024)), // Convert to MB
        free: Math.round(memData.available / (1024 * 1024)),
        usage: Math.round(memoryUsage)
      },
      diskSpace: {
        total: Math.round(mainDisk.size / (1024 * 1024 * 1024)), // Convert to GB
        free: Math.round(mainDisk.available / (1024 * 1024 * 1024)),
        usage: Math.round(diskUsage)
      }
    });
  } catch (error) {
    console.error('Error scanning system:', error);
    return NextResponse.json(
      { error: 'Failed to scan system information' },
      { status: 500 }
    );
  }
} 