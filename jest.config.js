module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.', // Base directory for resolving paths
    testRegex: '.*\\.spec\\.ts$', // Matches all `.spec.ts` files
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        'src/**/*.{ts,js}', // Collect coverage from src directory
        '!src/main.ts', // Exclude main.ts
        '!src/**/dto/**', // Exclude DTOs if desired
    ],
    coverageDirectory: './coverage', // Output coverage to the coverage directory
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', '<rootDir>'], // Resolve modules correctly
};
