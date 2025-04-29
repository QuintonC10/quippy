# Quippy - AI System Troubleshooter

Quippy is a modern, user-friendly AI assistant that helps diagnose and troubleshoot computer system issues. It provides real-time system analysis and personalized solutions to common computer problems.

## Features

- 🎨 Light and dark mode support
- 🔍 Real-time system scanning
- 💬 Interactive chat interface
- ⚡ Quick problem analysis
- 📱 Responsive design

## Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Git (for cloning the repository)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/quippy.git
cd quippy
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Starting a New Scan**
   - Click the "New Scan" button to initiate a system analysis
   - Wait for the scan to complete

2. **Describing Your Problem**
   - Type your computer issue in the input field
   - Press Enter or click the Send button
   - Receive AI-powered analysis and solutions

3. **Theme Switching**
   - Toggle between light and dark mode using the theme button
   - Theme preference is automatically saved

4. **Clearing Chat**
   - Use the "Clear Chat" button to start a new conversation

## Project Structure

```
quippy/
├── app/
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   ├── types/         # TypeScript interfaces
│   └── constants/     # Theme and animation constants
├── public/            # Static assets
└── package.json       # Project dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.

## Acknowledgments

- Built with Next.js and TypeScript
- Styled with Tailwind CSS
- Icons from Lucide React
