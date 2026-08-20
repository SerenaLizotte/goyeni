import "./BackButton.css";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

function BackButton({ onClick, label = "Back" }: BackButtonProps) {
  return (
    <button className="back-button" onClick={onClick} data-testid="back-button">
      &larr; {label}
    </button>
  );
}

export default BackButton;