'use client';

import { FaUser, FaCheck } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/types/user';
import {
	fetchCountriesInEurope,
} from '@/lib/functions/countries';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface ProfileInfoProps {
	user: User | null;
	handleUpdateUser: (e: React.FormEvent) => Promise<void>;
	updateSuccess: string;
	setUpdateSuccess: (message: string) => void;
	error: string | null;
	setError: (message: string | null) => void;
	disabled: boolean;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
	user,
	handleUpdateUser,
	updateSuccess,
	setUpdateSuccess,
	error,
	setError,
	disabled,
	setUser,
}) => {
	const countries = useMemo(() => fetchCountriesInEurope(), []);
	const [countrySearch, setCountrySearch] = useState('');

	// Filter countries based on search
	const filteredCountries = useMemo(() => {
		if (!countrySearch) return countries;
		return countries.filter((country) =>
			country.name.toLowerCase().includes(countrySearch.toLowerCase())
		);
	}, [countries, countrySearch]);

	// Common classes
	const formGroupClasses = 'group';
	const labelClasses =
		'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200';
	const inputClasses =
		'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-green-400 dark:hover:border-green-600';
	const disabledInputClasses =
		'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 cursor-not-allowed dark:text-white';
	const hintTextClasses = 'mt-1 text-xs text-gray-500 dark:text-gray-400';
	const sectionDividerClasses =
		'border-t border-gray-200 dark:border-gray-800 pt-4';
	const updateButtonClasses =
		'bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800 border border-green-600 dark:border-green-700 transition-colors shadow-sm hover:shadow-md';

	// Success message classes
	const successBoxClasses =
		'bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-700 dark:text-green-300 px-4 py-3 rounded-md mb-6';
	const successCloseButtonClasses =
		'ml-auto text-green-700 dark:text-green-300 hover:text-green-900 flex items-center justify-center dark:hover:text-green-200 text-2xl cursor-pointer';

	return (
		<div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 mb-6 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
			<h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
				<FaUser className='mr-3 h-5 w-5 text-green-600 dark:text-green-500' />
				Profile Information
			</h2>

			{updateSuccess && (
				<div className={successBoxClasses}>
					<div className='flex items-center'>
						<FaCheck className='h-4 w-4 mr-2' />
						<span>{updateSuccess}</span>
						<button
							className={successCloseButtonClasses}
							onClick={() => setUpdateSuccess('')}
						>
							&times;
						</button>
					</div>
				</div>
			)}

			{error && (
				<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-300 px-4 py-3 rounded-md mb-6'>
					<div className='flex items-center'>
						<span className='text-sm'>{error}</span>
						<button
							className='ml-auto text-red-700 dark:text-red-300 hover:text-red-900 flex items-center justify-center dark:hover:text-red-200 text-2xl'
							onClick={() => setError(null)}
						>
							&times;
						</button>
					</div>
				</div>
			)}

			<form className='space-y-6' onSubmit={handleUpdateUser}>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className={formGroupClasses}>
						<label htmlFor='name' className={labelClasses}>
							Full Name
						</label>
						<input
							type='text'
							id='name'
							name='name'
							defaultValue={user?.name}
							className={inputClasses}
						/>
					</div>
					<div className={formGroupClasses}>
						<label htmlFor='email' className={labelClasses}>
							Email Address
						</label>
						<input
							type='email'
							id='email'
							name='email'
							defaultValue={user?.email}
							className={disabledInputClasses}
							disabled
						/>
						<p className={hintTextClasses}>Email cannot be changed</p>
					</div>
					<div className={cn(formGroupClasses, 'block')}>
						<label htmlFor='city' className={labelClasses}>
							City / Town
						</label>
						<input
							type='text'
							id='city'
							name='city'
							key={`city-${user?.id}`}
							defaultValue={user?.location?.city || ''}
							onChange={(e) => {
								if (!user) return;
								setUser((prevUser) => {
									if (!prevUser) return prevUser;
									return {
										...prevUser,
										location: {
											...prevUser.location,
											city: e.target.value,
										},
									} as User;
								});
							}}
							className={inputClasses}
						/>
					</div>{' '}
					<div className={`block ${formGroupClasses}`}>
						<label htmlFor='country' className={labelClasses}>
							Country
						</label>
						<Select
							name='country'
							value={user?.location?.country || ''}
							onValueChange={(value) => {
								if (!user) return;
								setUser((prevUser) => {
									if (!prevUser) return prevUser;
									return {
										...prevUser,
										location: {
											...prevUser.location,
											country: value,
										},
									} as User;
								});
								setCountrySearch(''); // Reset search on selection
							}}
						>
							<SelectTrigger className={cn(inputClasses, 'justify-between')}>
								<SelectValue placeholder='Select your country'>
									{user?.location?.country && (
										<span className='flex items-center gap-2'>
											{user.location.country}
										</span>
									)}
								</SelectValue>
							</SelectTrigger>
							<SelectContent className='max-h-80 w-full bg-white dark:bg-gray-900 rounded-lg shadow-sm border-gray-200 dark:border-gray-800'>
								<div className='p-2 border-b border-gray-200 dark:border-gray-800'>
									<input
										type='text'
										placeholder='Search countries...'
										value={countrySearch}
										onChange={(e) => setCountrySearch(e.target.value)}
										className='w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
									/>
								</div>
								<div className='max-h-60 overflow-y-auto'>
									{filteredCountries.length > 0 ? (
										filteredCountries.map((country, index) => (
											<SelectItem
												key={index}
												value={country.name}
												className='text-black dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-800'
											>
												<span className='flex items-center gap-3'>
													<span className='text-lg'>{country.flag}</span>
													<span className='text-sm'>{country.name}</span>
												</span>
											</SelectItem>
										))
									) : (
										<div className='p-4 text-center text-sm text-gray-500 dark:text-gray-400'>
											No countries found
										</div>
									)}
								</div>
							</SelectContent>
						</Select>
						<p className={hintTextClasses}>
							Search and select your country from the list
						</p>
					</div>
				</div>

				<div className={sectionDividerClasses}>
					<div className={formGroupClasses}>
						<label htmlFor='bio' className={labelClasses}>
							Bio
						</label>
						<textarea
							id='bio'
							name='bio'
							rows={4}
							defaultValue={user?.bio || ''}
							className={inputClasses}
							onChange={(e) => {
								if (!user) return;
								setUser((prevUser) => {
									if (!prevUser) return prevUser;
									return {
										...prevUser,
										bio: e.target.value,
									} as User;
								});
							}}
						/>
						<p className={hintTextClasses}>
							Write a short bio to tell others about yourself
						</p>
					</div>
				</div>

				<div className='flex justify-end'>
					<Button
						type='submit'
						disabled={disabled}
						className={updateButtonClasses}
					>
						Update Profile
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ProfileInfo;
