export const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', err);
    if (err.name === 'ZodError') {
        return res.status(400).json({
            error: 'Validation error',
            details: err
        });
    }
    if (err.name === 'PrismaClientKnownRequestError') {
        return res.status(400).json({
            error: 'Database error',
            message: err.message
        });
    }
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};
export function notFound(_req, res) {
    res.status(404).json({ error: 'Route not found' });
}
//# sourceMappingURL=error.js.map