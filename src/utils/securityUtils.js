/**
 * Evaluates security risk based on trusted profile and current login context
 */
export function evaluateSecurityRisk(user, context) {
    const isCityTrusted = user.trustedCities.some(
        (c) => c.toLowerCase() === context.city.toLowerCase()
    );
    const isStateTrusted = user.trustedStates.some(
        (s) => s.toLowerCase() === context.state.toLowerCase()
    );

    const isDeviceTrusted = user.trustedDevices.some(
        (d) => d.toLowerCase() === context.device.toLowerCase()
    );

    const isNewCity = !isCityTrusted;
    const isNewState = !isStateTrusted;
    const isNewDevice = !isDeviceTrusted;

    const requiresOtp = isNewCity || isNewState || isNewDevice;

    let riskLevel = 'LOW';
    const riskFactors = [];

    if (isNewDevice) {
        riskFactors.push(`Unrecognized Device (${context.device})`);
        riskLevel = 'MEDIUM';
    }

    if (isNewCity) {
        riskFactors.push(`Unrecognized City (${context.city})`);
        riskLevel = riskLevel === 'MEDIUM' ? 'HIGH' : 'MEDIUM';
    }

    if (isNewState) {
        riskFactors.push(`Unrecognized State (${context.state})`);
        riskLevel = 'HIGH';
    }

    let summaryReason = 'Login from verified trusted device & location.';
    if (requiresOtp) {
        summaryReason = `Security Trigger: Login detected from ${riskFactors.join(
            ', '
        )}. OTP verification mandatory.`;
    }

    return {
        requiresOtp,
        riskLevel,
        isNewCity,
        isNewState,
        isNewDevice,
        riskFactors,
        summaryReason,
    };
}

/**
 * Generates a random 6-digit numeric OTP code
 */
export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
