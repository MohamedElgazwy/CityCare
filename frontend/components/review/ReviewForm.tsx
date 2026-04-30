"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';

type Props = {
  bookingId: number;
  onSuccess?: () => void;
};

export default function ReviewForm({ bookingId, onSuccess }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!rating || rating < 1 || rating > 5) return setError('Rating must be between 1 and 5');
    if (!comment.trim()) return setError('Comment is required');
    setLoading(true);
    try {
      await api(`/reviews/${bookingId}`, { method: 'POST', body: JSON.stringify({ rating, comment }) });
      setComment('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded border p-1">
          {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} ★</option>)}
        </select>
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review" className="w-full rounded border p-2" />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div>
        <Button onClick={submit} disabled={loading} variant="primary">{loading ? 'Submitting...' : 'Submit review'}</Button>
      </div>
    </div>
  );
}
