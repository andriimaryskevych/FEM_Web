const getCoordinates = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
};

const normalizedCoordinates = (point, width, height) => {
    const { x, y } = point;

    return {
        x: x / width * 2 - 1,
        y: - (y / height) * 2 + 1
    }
};

export const getNormalizedCoordinates = (event, canvas, width, height) => {
    const point = getCoordinates(event, canvas);
    return normalizedCoordinates(point, width, height);
}
