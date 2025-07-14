import { useState, useCallback } from 'react';

interface ValidationRules {
  [key: string]: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: string) => boolean;
  };
}

interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((name: string, value: string): boolean => {
    const fieldRules = rules[name];
    if (!fieldRules) return true;

    if (fieldRules.required && !value) {
      setErrors(prev => ({
        ...prev,
        [name]: 'This field is required'
      }));
      return false;
    }

    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Invalid format'
      }));
      return false;
    }

    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      setErrors(prev => ({
        ...prev,
        [name]: `Minimum length is ${fieldRules.minLength} characters`
      }));
      return false;
    }

    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      setErrors(prev => ({
        ...prev,
        [name]: `Maximum length is ${fieldRules.maxLength} characters`
      }));
      return false;
    }

    if (fieldRules.custom && !fieldRules.custom(value)) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Invalid value'
      }));
      return false;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    return true;
  }, [rules]);

  const validateAll = useCallback((values: { [key: string]: string }): boolean => {
    let isValid = true;
    const newErrors: ValidationErrors = {};

    Object.keys(rules).forEach(name => {
      if (!validate(name, values[name])) {
        isValid = false;
        newErrors[name] = errors[name] || 'Invalid value';
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validate, errors]);

  return {
    errors,
    validate,
    validateAll,
    clearErrors: () => setErrors({}),
  };
} 