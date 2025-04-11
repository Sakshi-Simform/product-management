export class ValidateForm {
    private readonly regexValidation: RegExp = /^[A-Za-z\s]+[A-Za-z0-9\s]*$/;

    private RegexValidation(
        value: string,
        regex: RegExp,
        maxLength: number,
        fieldName: string
    ): string {
        if (!value) return `Please provide a ${fieldName}.`;
        if (!regex.test(value)) {
            return `${fieldName} contains invalid characters. Only letters, numbers, and spaces allowed, starting with a letter.`;
        }
        if (value.length > maxLength) return `${fieldName} must not exceed ${maxLength} characters.`;
        return '';
    }

    validateTitle(title: string): string {
        return this.RegexValidation(title, this.regexValidation, 50, 'title');
    }

    validateDescription(description: string): string {
        return this.RegexValidation(description, this.regexValidation, 100, 'description');
    }

    showError(inputId: string, message: string): void {
        const errorElement = document.getElementById(`${inputId}Error`) as HTMLElement;
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block'; 
        }
    }

    clearError(inputId: string): void {
        const errorElement = document.getElementById(`${inputId}Error`) as HTMLElement;
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none'; 
        }
    }
}