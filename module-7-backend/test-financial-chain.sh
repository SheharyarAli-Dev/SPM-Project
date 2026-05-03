#!/bin/bash
# Financial Chain Verification Test
BASE=http://localhost:3001

echo "=== STEP A: Fund wallet (user 1) ==="
curl -s -X POST "$BASE/wallets/fund" \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"user_id":1,"amount":1000}' | python3 -m json.tool
echo ""

echo "=== Verify wallet balance ==="
curl -s "$BASE/wallets/user/1" -H "x-user-id: 1" | python3 -m json.tool
echo ""

echo "=== STEP B: Create escrow ==="
ESCROW=$(curl -s -X POST "$BASE/escrow" \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"project_id":99,"client_user_id":1,"freelancer_user_id":2,"currency_code":"USD","total_amount":500}')
echo "$ESCROW" | python3 -m json.tool
ESCROW_ID=$(echo "$ESCROW" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "Escrow ID: $ESCROW_ID"
echo ""

echo "=== STEP C: Fund escrow ==="
curl -s -X POST "$BASE/escrow/$ESCROW_ID/fund" \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"amount":500}' | python3 -m json.tool
echo ""

echo "=== Verify wallet decreased ==="
curl -s "$BASE/wallets/user/1" -H "x-user-id: 1" | python3 -m json.tool
echo ""

echo "=== Verify transaction created ==="
WALLET_ID=$(curl -s "$BASE/wallets/user/1" -H "x-user-id: 1" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
curl -s "$BASE/transactions?wallet_id=$WALLET_ID" | python3 -m json.tool
echo ""

echo "=== STEP D: Create milestone payment ==="
MILESTONE=$(curl -s -X POST "$BASE/milestone-payments" \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d "{\"escrow_id\":$ESCROW_ID,\"milestone_id\":99,\"title\":\"Phase 1\",\"amount\":250}")
echo "$MILESTONE" | python3 -m json.tool
MILESTONE_ID=$(echo "$MILESTONE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "Milestone ID: $MILESTONE_ID"
echo ""

echo "=== STEP E: Approve milestone ==="
curl -s -X PATCH "$BASE/milestone-payments/$MILESTONE_ID/approve" \
  -H "x-user-id: 1" | python3 -m json.tool
echo ""

echo "=== STEP F: Release milestone payment ==="
curl -s -X PATCH "$BASE/milestone-payments/$MILESTONE_ID/release" \
  -H "x-user-id: 1" | python3 -m json.tool
echo ""

echo "=== Verify freelancer wallet (user 2) ==="
curl -s "$BASE/wallets/user/2" -H "x-user-id: 2" | python3 -m json.tool
echo ""

echo "=== Verify freelancer notifications ==="
curl -s "$BASE/notifications?recipient_id=2" | python3 -m json.tool
echo ""

echo "=== STEP G: Create refund ==="
REFUND=$(curl -s -X POST "$BASE/refunds" \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d "{\"transaction_id\":1,\"escrow_id\":$ESCROW_ID,\"requested_by\":1,\"reason\":\"Work not delivered as agreed upon in contract\",\"refund_amount\":100}")
echo "$REFUND" | python3 -m json.tool
REFUND_ID=$(echo "$REFUND" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "Refund ID: $REFUND_ID"
echo ""

echo "=== Approve refund ==="
curl -s -X PATCH "$BASE/refunds/$REFUND_ID/approve" \
  -H "Content-Type: application/json" \
  -H "x-user-id: 99" \
  -d '{"admin_id":99}' | python3 -m json.tool
echo ""

echo "=== Verify client wallet after refund ==="
curl -s "$BASE/wallets/user/1" -H "x-user-id: 1" | python3 -m json.tool
echo ""

echo "=== Verify refund notification ==="
curl -s "$BASE/notifications?recipient_id=1" | python3 -m json.tool
echo ""

echo "=== STEP H: Create withdrawal ==="
WITHDRAWAL=$(curl -s -X POST "$BASE/withdrawals" \
  -H "Content-Type: application/json" \
  -H "x-user-id: 2" \
  -d "{\"amount\":100,\"payment_method_id\":1,\"wallet_id\":$(curl -s "$BASE/wallets/user/2" -H "x-user-id: 2" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null),\"currency_code\":\"USD\"}")
echo "$WITHDRAWAL" | python3 -m json.tool
WITHDRAWAL_ID=$(echo "$WITHDRAWAL" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
echo "Withdrawal ID: $WITHDRAWAL_ID"
echo ""

echo "=== Approve withdrawal ==="
curl -s -X PATCH "$BASE/withdrawals/$WITHDRAWAL_ID/approve" \
  -H "x-user-id: 99" | python3 -m json.tool
echo ""

echo "=== Verify freelancer wallet after withdrawal ==="
curl -s "$BASE/wallets/user/2" -H "x-user-id: 2" | python3 -m json.tool
echo ""

echo "=== Verify withdrawal notification ==="
curl -s "$BASE/notifications?recipient_id=2" | python3 -m json.tool
echo ""

echo "=== VALIDATION TEST: Reject invalid amount ==="
curl -s -X POST "$BASE/wallets/fund" \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"user_id":1,"amount":-50}' | python3 -m json.tool
echo ""

echo "=== DONE ==="
