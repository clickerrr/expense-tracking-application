import '@/styles/spinnerstyles.css';

interface SpinnerProps {
	textToDisplay: string | null;
}

const LoadingSpinner = ({textToDisplay}: SpinnerProps) => {
	return (
		<>
			{textToDisplay ? <span className="text-to-display">{textToDisplay}</span> : <></>}
			<div className="spinner"></div>
		</>
	);
};
export default LoadingSpinner;
