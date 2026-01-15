const OpenAI = require('openai');
const WDIOReporter = require('@wdio/reporter').default || require('@wdio/reporter');

class AIReporter extends WDIOReporter {
    constructor(options) {
        super(options);

        this.failedTests = [];
        this.openai = new OpenAI({ apiKey: 'exampleAPIKEY' });

        // NEW: Initialize a flag to tell WDIO we are ready
        this._isSynchronised = true;
    }

    // NEW: WDIO checks this getter constantly. 
    // If it returns false, WDIO will pause closing the process.
    get isSynchronised() {
        return this._isSynchronised;
    }

    onTestFail(test) {
        this.failedTests.push({
            title: test.title,
            error: test.error && test.error.message ? test.error.message : 'Unknown error',
            stack: test.error && test.error.stack ? test.error.stack : ''
        });
    }

    async onRunnerEnd(runner) {
        if (this.failedTests.length === 0) {
            return;
        }

        // 1. Tell WDIO to wait! We have work to do.
        this._isSynchronised = false;

        console.log('\n🤖 AI is analyzing failures for Manual QAs...\n');

        try {
            const summary = await this.generateAISummary(this.failedTests);
            
            console.log('---------------------------------------------------');
            console.log('             AI SIMPLE LANGUAGE REPORT             ');
            console.log('---------------------------------------------------');
            console.log(summary);
            console.log('---------------------------------------------------');
        } catch (err) {
            console.error('Failed to generate AI summary:', err);
        } finally {
            // 2. We are done. Tell WDIO it is safe to exit.
            this._isSynchronised = true;
        }
    }

    async generateAISummary(failures) {
        const simplifiedFailures = failures.map(f => ({
            title: f.title,
            error: f.error,
            stackSnippet: f.stack.split('\n').slice(0, 3).join('\n')
        }));

        const prompt = `
        You are a QA Lead. Translate these automated test failures into simple language for manual testers.
        
        Rules:
        1. No technical jargon.
        2. Focus on the User Experience impact.
        3. Format as a list: "Test Name -> Root Cause".

        Failures:
        ${JSON.stringify(simplifiedFailures, null, 2)}
        `;

        const response = await this.openai.chat.completions.create({
            model: "gpt-4.1", 
            messages: [{ role: "user", content: prompt }],
        });

        return response.choices[0].message.content || "No summary generated.";
    }
}

module.exports = AIReporter;