package com.transitops.service.rule;

import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Service;

@Service
public class RuleEngineService {

    private final ExpressionParser parser = new SpelExpressionParser();

    public boolean evaluateCondition(String expressionStr, Object contextRoot) {
        try {
            StandardEvaluationContext context = new StandardEvaluationContext(contextRoot);
            return Boolean.TRUE.equals(parser.parseExpression(expressionStr).getValue(context, Boolean.class));
        } catch (Exception e) {
            return false;
        }
    }
}
