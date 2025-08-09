const Card = ({ title, description, children }) => (
  <div className="border rounded-lg p-4 bg-white shadow">
    {title && <h2 className="text-lg font-bold mb-1">{title}</h2>}
    {description && <p className="text-sm text-gray-500 mb-3">{description}</p>}
    {children}
  </div>
);

export default Card;