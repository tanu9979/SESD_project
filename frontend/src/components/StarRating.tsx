interface Props {
  value: number;
  readonly?: boolean;
  onChange?: (v: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ value, readonly = false, onChange, size = 'md' }: Props) => {
  const sizes = { sm: 'text-sm', md: 'text-xl', lg: 'text-3xl' };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          className={`${sizes[size]} ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'} ${star <= Math.round(value) ? 'text-folio-gold' : 'text-gray-300'}`}
        >★</button>
      ))}
    </div>
  );
};

export default StarRating;
