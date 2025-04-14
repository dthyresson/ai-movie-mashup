export const Footer = () => (
  <footer className="font-banner border-t border-purple-600 py-4 px-6">
    <div className="container mx-auto flex flex-wrap justify-between items-center text-gray-600">
      <nav className="flex items-center gap-4" aria-label="Footer left navigation">
        <p className="flex items-center">
          <span>© {new Date().getFullYear()}</span>
          {' '}
          <a
            href="https://www.thyresson.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 transition-colors ml-1"
            aria-label="Visit DT's website"
          >
            DT
          </a>
        </p>
        <div className="h-4 w-px bg-gray-300" role="separator" aria-hidden="true" />
        <a
          href="https://github.com/dthyresson/ai-movie-mashup"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-2"
          aria-label="View source on GitHub"
        >
          <img src="/github-mark.svg" alt="" className="w-4 h-4" aria-hidden="true" />

          View source on GitHub
        </a>
      </nav>

      <div className="flex items-center gap-2">
        <span className="text-sm">Made with</span>
        <a
          href="https://www.rwsdk.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-800 hover:text-amber-900 transition-colors flex items-center gap-2"
          aria-label="Visit RedwoodSDK website"
        >
          <img src="/rwsdk.svg" alt="" className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm">RedwoodSDK</span>
        </a>
      </div>
    </div>
  </footer>
);
