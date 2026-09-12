/**
 * Evaluates security risk based on trusted profile and current login context
 */
export function evaluateSecurityRisk(user, context) {
    const isEmailDifferent = context.email && context.email.toLowerCase() !== user.email.toLowerCase();

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

    const requiresOtp = isEmailDifferent || isNewCity || isNewState || isNewDevice;

    let riskLevel = 'LOW';
    const riskFactors = [];

    if (isEmailDifferent) {
        riskFactors.push(`New Email Account (${context.email})`);
        riskLevel = 'HIGH';
    }

    if (isNewDevice) {
        riskFactors.push(`Unrecognized Device (${context.device})`);
        if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
    }

    if (isNewCity) {
        riskFactors.push(`Unrecognized City (${context.city})`);
        if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
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
        isEmailDifferent,
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
