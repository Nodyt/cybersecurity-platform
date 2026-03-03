
# 1. Login to get token
echo "Logging in..."
LOGIN_RESP=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cyber.edu","password":"password123"}')

TOKEN=$(echo $LOGIN_RESP | python -c "import sys, json; print(json.load(sys.stdin)['token'])")
echo "Token obtained."

# 2. Fetch Inbox
echo "\nFetching Inbox..."
curl -s -X GET http://localhost:3000/api/simulation/inbox \
  -H "Authorization: Bearer $TOKEN" | python -c "import sys, json; data=json.load(sys.stdin); print(f'Inbox size: {len(data)}'); print('First Email:', data[0]['title'])"

# 3. Submit Drill (Simulate passing)
echo "\nSubmitting Drill (All Correct)..."
# We need simulation IDs to submit. Let's fetch them first properly
INBOX_JSON=$(curl -s -X GET http://localhost:3000/api/simulation/inbox -H "Authorization: Bearer $TOKEN")

# Construct answers payload in python for simplicity
PAYLOAD=$(python -c "
import sys, json
data = json.loads('''$INBOX_JSON''')
answers = []
for sim in data:
    # If isPhishing is true, verdict PHISHING, else SAFE
    verdict = 'PHISHING' if sim.get('isPhishing') else 'SAFE'
    answers.append({'simulationId': sim['id'], 'verdict': verdict})
print(json.dumps({'answers': answers}))
")

curl -s -X POST http://localhost:3000/api/simulation/submit-drill \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$PAYLOAD"

# 4. Check Progress Stats (Risk Score should decrease)
echo "\n\nChecking Progress Stats..."
curl -s -X GET http://localhost:3000/api/training/status \
  -H "Authorization: Bearer $TOKEN" | python -c "import sys, json; data=json.load(sys.stdin); print(f'Risk Score: {data['riskScore']}'); print(f'Excellence Score: {data['excellenceScore']}')"
