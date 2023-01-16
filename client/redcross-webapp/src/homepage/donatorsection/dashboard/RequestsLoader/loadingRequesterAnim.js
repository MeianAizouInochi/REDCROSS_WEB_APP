import './loadingRequesterAnim.css'

const LoadingIcon = () => {
    let thickness = 0.5;
    let color = "red";
	return (
        <svg
            className="svg"
            viewBox="0 0 24 24"
            xmlns="<http://www.w3.org/2000/svg>"
        >
            <circle
                className="path"
                cx="12"
                cy="12"
                r="3"
                strokeLinecap="round"
                strokeWidth={thickness}
                stroke={color}
                fill="none"
            />
        </svg>
	)
}
export default LoadingIcon;