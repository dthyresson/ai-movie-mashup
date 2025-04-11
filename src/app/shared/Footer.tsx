export const Footer = () => (
  <footer className="font-banner border-purple-600 border-t p-4">
    <div className="flex justify-between text-gray-600">
      <p>© {new Date().getFullYear()} DT</p>
      <p>
        Made with{" "}
        <a
          href="https://www.rwsdk.com"
          target="_blank"
          className="text-purple-600"
        >
          RedwoodSDK
        </a>
      </p>
    </div>
  </footer>
);
